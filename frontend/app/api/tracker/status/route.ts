import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const state = await prisma.trackerState.findUnique({
      where: { id: 'singleton' }
    })

    return NextResponse.json({
      isActive: state?.isActive ?? false,
      lastPingTime: state?.lastPingTime,
      currentApp: state?.currentAppName
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get tracker status' },
      { status: 500 }
    )
  }
}
