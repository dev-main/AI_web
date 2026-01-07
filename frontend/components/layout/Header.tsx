'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Play, Square, Activity } from 'lucide-react'

export function Header() {
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    const res = await fetch('/api/tracker/status')
    const data = await res.json()
    setIsActive(data.isActive)
  }

  const handleStart = async () => {
    setLoading(true)
    try {
      await fetch('/api/tracker/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: 60000 })
      })
      setIsActive(true)
    } catch (error) {
      console.error('Failed to start tracker:', error)
    }
    setLoading(false)
  }

  const handleStop = async () => {
    setLoading(true)
    try {
      await fetch('/api/tracker/stop', { method: 'POST' })
      setIsActive(false)
    } catch (error) {
      console.error('Failed to stop tracker:', error)
    }
    setLoading(false)
  }

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Focus Flow</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span className="text-sm text-gray-400">
              {isActive ? 'Tracking' : 'Stopped'}
            </span>
          </div>

          {isActive ? (
            <Button
              onClick={handleStop}
              disabled={loading}
              variant="secondary"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop Tracking
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              disabled={loading}
              variant="primary"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Tracking
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
