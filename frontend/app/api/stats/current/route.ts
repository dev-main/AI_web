import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const state = await prisma.trackerState.findUnique({
      where: { id: 'singleton' }
    })

    if (!state?.currentSessionId) {
      return NextResponse.json({ session: null })
    }

    const session = await prisma.focusSession.findUnique({
      where: { id: state.currentSessionId }
    })

    if (!session) {
      return NextResponse.json({ session: null })
    }

    // Calculate live duration
    const duration = Math.floor(
      (Date.now() - session.startTime.getTime()) / 1000
    )

    return NextResponse.json({
      session: {
        appName: session.appName,
        windowTitle: session.windowTitle,
        duration,
        startTime: session.startTime
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch current session' },
      { status: 500 }
    )
  }
}
