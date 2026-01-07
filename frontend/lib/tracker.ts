import { prisma } from './prisma'
import { getActiveApp } from './applescript'

export class FocusTracker {
  private intervalId: NodeJS.Timeout | null = null
  private currentSessionId: string | null = null
  private lastAppName: string | null = null

  async start(intervalMs: number = 60000) {
    // Initialize tracker state
    await prisma.trackerState.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', isActive: true },
      update: { isActive: true, lastPingTime: new Date() }
    })

    // Start tracking loop
    this.intervalId = setInterval(() => this.tick(), intervalMs)
    await this.tick() // Immediate first tick

    return { status: 'started', interval: intervalMs }
  }

  async stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    // Close current session
    if (this.currentSessionId) {
      await this.closeSession(this.currentSessionId)
    }

    // Update tracker state
    await prisma.trackerState.update({
      where: { id: 'singleton' },
      data: {
        isActive: false,
        currentSessionId: null,
        currentAppName: null
      }
    })

    return { status: 'stopped' }
  }

  private async tick() {
    try {
      const activeApp = await getActiveApp()

      // Update tracker state heartbeat
      await prisma.trackerState.update({
        where: { id: 'singleton' },
        data: {
          lastPingTime: new Date(),
          currentAppName: activeApp.appName
        }
      })

      // Check if app changed
      if (activeApp.appName !== this.lastAppName) {
        // Close previous session
        if (this.currentSessionId) {
          await this.closeSession(this.currentSessionId)
        }

        // Start new session
        this.currentSessionId = await this.startSession(activeApp)
        this.lastAppName = activeApp.appName
      } else {
        // Update existing session duration
        if (this.currentSessionId) {
          await this.updateSession(this.currentSessionId)
        }
      }
    } catch (error) {
      console.error('Tracker tick error:', error)
    }
  }

  private async startSession(app: any): Promise<string> {
    const session = await prisma.focusSession.create({
      data: {
        appName: app.appName,
        windowTitle: app.windowTitle,
        startTime: app.timestamp,
        duration: 0
      }
    })

    await prisma.trackerState.update({
      where: { id: 'singleton' },
      data: { currentSessionId: session.id }
    })

    return session.id
  }

  private async updateSession(sessionId: string) {
    const session = await prisma.focusSession.findUnique({
      where: { id: sessionId }
    })

    if (session) {
      const duration = Math.floor(
        (Date.now() - session.startTime.getTime()) / 1000
      )

      await prisma.focusSession.update({
        where: { id: sessionId },
        data: { duration, endTime: new Date() }
      })
    }
  }

  private async closeSession(sessionId: string) {
    await this.updateSession(sessionId)
  }
}

// Singleton instance
let trackerInstance: FocusTracker | null = null

export function getTrackerInstance(): FocusTracker {
  if (!trackerInstance) {
    trackerInstance = new FocusTracker()
  }
  return trackerInstance
}
