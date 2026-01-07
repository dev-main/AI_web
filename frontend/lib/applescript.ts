import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface ActiveApp {
  appName: string
  windowTitle?: string
  timestamp: Date
}

export async function getActiveApp(): Promise<ActiveApp> {
  try {
    const { stdout: appName } = await execAsync(
      'osascript -e \'tell application "System Events" to get name of first process whose frontmost is true\''
    )

    // Attempt to get window title (may fail for some apps)
    let windowTitle: string | undefined
    try {
      const { stdout: title } = await execAsync(
        'osascript -e \'tell application "System Events" to get title of window 1 of first process whose frontmost is true\''
      )
      windowTitle = title.trim()
    } catch {
      windowTitle = undefined
    }

    return {
      appName: appName.trim(),
      windowTitle,
      timestamp: new Date()
    }
  } catch (error: any) {
    if (error.message && error.message.includes('not allowed')) {
      throw new Error(
        'Accessibility permissions required. Please grant permissions in System Settings > Privacy & Security > Accessibility'
      )
    }
    throw new Error(`Failed to get active app: ${error}`)
  }
}
