import { useEffect, useState } from 'react'

const TICK_MS = 1000

/** Current unix time in seconds, re-rendering once per second. */
export function useNow(): number {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))
  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), TICK_MS)
    return () => clearInterval(timer)
  }, [])
  return now
}
