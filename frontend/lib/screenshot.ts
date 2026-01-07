import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'

const execAsync = promisify(exec)

export interface ScreenshotResult {
  success: boolean
  filePath?: string
  error?: string
}

/**
 * Captures a screenshot of the active window using macOS screencapture
 * Saves to public/screenshots/YYYY-MM-DD/timestamp-appname.png
 */
export async function captureActiveWindow(appName: string): Promise<ScreenshotResult> {
  try {
    // Create directory structure: public/screenshots/YYYY-MM-DD/
    const today = new Date().toISOString().split('T')[0]
    const screenshotDir = path.join(process.cwd(), 'public', 'screenshots', today)
    await fs.mkdir(screenshotDir, { recursive: true })

    // Generate filename: timestamp-appname.png
    const timestamp = Date.now()
    const sanitizedAppName = appName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const filename = `${timestamp}-${sanitizedAppName}.png`
    const filePath = path.join(screenshotDir, filename)

    // Capture active window using macOS screencapture
    // -o: capture window only (not shadow)
    // -x: no sound
    // -w: capture window (user needs to click or use with -W for window ID)
    // Note: -w flag will wait for user to click a window, so we use alternative approach
    // Use -T 0 to capture frontmost window immediately
    await execAsync(`screencapture -o -x -T 0 "${filePath}"`)

    // Return relative path for database storage
    const relativePath = `/screenshots/${today}/${filename}`
    return { success: true, filePath: relativePath }
  } catch (error: any) {
    console.error('Screenshot capture failed:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Deletes screenshots older than specified days
 */
export async function cleanupOldScreenshots(daysToKeep: number = 7): Promise<number> {
  try {
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots')

    // Check if directory exists
    try {
      await fs.access(screenshotsDir)
    } catch {
      return 0 // Directory doesn't exist yet
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    let deletedCount = 0
    const dateFolders = await fs.readdir(screenshotsDir)

    for (const folder of dateFolders) {
      // Parse folder name as date (YYYY-MM-DD)
      const folderDate = new Date(folder)
      if (folderDate < cutoffDate) {
        const folderPath = path.join(screenshotsDir, folder)
        await fs.rm(folderPath, { recursive: true, force: true })
        deletedCount++
      }
    }

    return deletedCount
  } catch (error) {
    console.error('Cleanup failed:', error)
    return 0
  }
}
