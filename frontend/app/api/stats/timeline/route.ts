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

    // Aggregate by hour
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      duration: 0,
      label: `${hour.toString().padStart(2, '0')}:00`
    }))

    sessions.forEach(session => {
      const hour = session.startTime.getHours()
      hourlyData[hour].duration += session.duration
    })

    return NextResponse.json({
      date: targetDate,
      timeline: hourlyData
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch timeline data' },
      { status: 500 }
    )
  }
}
