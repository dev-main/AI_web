'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { formatDuration } from '@/lib/utils'
import { Activity } from 'lucide-react'

interface CurrentSession {
  appName: string
  windowTitle: string | null
  duration: number
  startTime: Date
}

export function LiveStatus() {
  const [session, setSession] = useState<CurrentSession | null>(null)
  const [liveDuration, setLiveDuration] = useState(0)

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const res = await fetch('/api/stats/current')
        const data = await res.json()
        setSession(data.session)
        if (data.session) {
          setLiveDuration(data.session.duration)
        }
      } catch (error) {
        console.error('Failed to fetch current session:', error)
      }
    }

    fetchCurrent()
    const interval = setInterval(fetchCurrent, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!session) return

    const ticker = setInterval(() => {
      setLiveDuration(prev => prev + 1)
    }, 1000)

    return () => clearInterval(ticker)
  }, [session])

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-green-500/10 p-3">
          <Activity className="h-6 w-6 text-green-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400">Currently Active</p>
          <p className="text-2xl font-semibold text-white">
            {session?.appName || 'No active app'}
          </p>
          {session?.windowTitle && (
            <p className="text-sm text-gray-500 truncate">
              {session.windowTitle}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-500">
            {formatDuration(liveDuration)}
          </p>
          <p className="text-xs text-gray-500">Duration</p>
        </div>
      </div>
    </Card>
  )
}
