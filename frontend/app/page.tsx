import { LiveStatus } from '@/components/dashboard/LiveStatus'
import { DailyBreakdown } from '@/components/dashboard/DailyBreakdown'
import { TimelineChart } from '@/components/dashboard/TimelineChart'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <LiveStatus />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyBreakdown />
        <TimelineChart />
      </div>
    </div>
  )
}
