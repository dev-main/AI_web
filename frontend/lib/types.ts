export interface SessionData {
  id: string
  appName: string
  windowTitle: string | null
  startTime: Date
  endTime: Date | null
  duration: number
}

export interface DailyStats {
  appName: string
  totalDuration: number
  sessionCount: number
  percentage: number
}

export interface TimelineData {
  hour: number
  duration: number
  label: string
}

export interface CurrentSession {
  appName: string
  windowTitle: string | null
  duration: number
  startTime: Date
}
