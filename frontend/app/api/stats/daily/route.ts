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
        }
      }
    })

    // Aggregate by app
    const appStats = sessions.reduce((acc, session) => {
      if (!acc[session.appName]) {
        acc[session.appName] = {
          appName: session.appName,
          totalDuration: 0,
          sessionCount: 0
        }
      }
      acc[session.appName].totalDuration += session.duration
      acc[session.appName].sessionCount += 1
      return acc
    }, {} as Record<string, any>)

    const totalDuration = Object.values(appStats).reduce(
      (sum: number, app: any) => sum + app.totalDuration,
      0
    )

    const stats = Object.values(appStats).map((app: any) => ({
      ...app,
      percentage: totalDuration > 0
        ? (app.totalDuration / totalDuration) * 100
        : 0
    }))

    return NextResponse.json({
      date: targetDate,
      stats: stats.sort((a: any, b: any) => b.totalDuration - a.totalDuration),
      totalDuration
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch daily stats' },
      { status: 500 }
    )
  }
}
