'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { formatTime } from '@/lib/utils'
import Image from 'next/image'
import { Clock } from 'lucide-react'

interface Screenshot {
  id: string
  appName: string
  windowTitle: string | null
  startTime: Date
  duration: number
  screenshotPath: string
}

export function ScreenshotTimeline() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const res = await fetch('/api/screenshots/timeline')
        const json = await res.json()
        if (json.screenshots && Array.isArray(json.screenshots)) {
          setScreenshots(json.screenshots.map((s: any) => ({
            ...s,
            startTime: new Date(s.startTime)
          })))
        }
      } catch (error) {
        console.error('Failed to fetch screenshots:', error)
      }
    }

    fetchScreenshots()
    const interval = setInterval(fetchScreenshots, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Screenshot Timeline
        </h3>

        {screenshots && screenshots.length > 0 ? (
          <div className="space-y-4">
            {screenshots.map((screenshot) => (
              <div
                key={screenshot.id}
                className="flex gap-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => setSelectedImage(screenshot.screenshotPath)}
              >
                {/* Thumbnail */}
                <div className="relative w-32 h-20 flex-shrink-0 bg-gray-900 rounded overflow-hidden">
                  <Image
                    src={screenshot.screenshotPath}
                    alt={`${screenshot.appName} screenshot`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {screenshot.appName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(screenshot.startTime)}
                    </span>
                  </div>
                  {screenshot.windowTitle && (
                    <p className="text-sm text-gray-400 truncate mt-1">
                      {screenshot.windowTitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No screenshots yet. Start tracking to see your activity timeline.
          </div>
        )}
      </Card>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <Image
              src={selectedImage}
              alt="Screenshot preview"
              width={1920}
              height={1080}
              className="max-w-full max-h-screen object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  )
}
