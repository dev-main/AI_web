'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDuration } from '@/lib/utils'

export function TimelineChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch('/api/stats/timeline')
        const json = await res.json()
        if (json.timeline && Array.isArray(json.timeline)) {
          setData(json.timeline)
        }
      } catch (error) {
        console.error('Failed to fetch timeline:', error)
      }
    }

    fetchTimeline()
    const interval = setInterval(fetchTimeline, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">
        Activity Timeline
      </h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="label"
              stroke="#9ca3af"
              interval={2}
            />
            <YAxis
              stroke="#9ca3af"
              tickFormatter={(value) => formatDuration(value)}
            />
            <Tooltip
              formatter={(value: number) => formatDuration(value)}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="duration" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No activity data yet
        </div>
      )}
    </Card>
  )
}
