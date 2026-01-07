import { NextResponse } from 'next/server'
import { getTrackerInstance } from '@/lib/tracker'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { interval = 60000 } = body
    const tracker = getTrackerInstance()
    const result = await tracker.start(interval)

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to start tracker' },
      { status: 500 }
    )
  }
}
