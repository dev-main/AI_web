import { NextResponse } from 'next/server'
import { getTrackerInstance } from '@/lib/tracker'

export async function POST() {
  try {
    const tracker = getTrackerInstance()
    const result = await tracker.stop()

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to stop tracker' },
      { status: 500 }
    )
  }
}
