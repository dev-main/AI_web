import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const targetDate = dateParam ? new Date(dateParam) : new Date()

    const sessions = await prisma.focusSession.findMany({
      where: {
        startTime: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate)
        },
        screenshotPath: { not: null } // Only sessions with screenshots
      },
      orderBy: { startTime: 'asc' },
      select: {
        id: true,
        appName: true,
        windowTitle: true,
        startTime: true,
        duration: true,
        screenshotPath: true
      }
    })

    return NextResponse.json({
      date: targetDate,
      screenshots: sessions
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch screenshots' },
      { status: 500 }
    )
  }
}
