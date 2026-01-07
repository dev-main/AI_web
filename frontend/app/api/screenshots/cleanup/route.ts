import { NextResponse } from 'next/server'
import { cleanupOldScreenshots } from '@/lib/screenshot'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Delete old screenshot files
    const deletedFolders = await cleanupOldScreenshots(7)

    // Also cleanup database records older than 7 days
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 7)

    const result = await prisma.focusSession.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    })

    return NextResponse.json({
      success: true,
      deletedFolders,
      deletedSessions: result.count
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Cleanup failed' },
      { status: 500 }
    )
  }
}
