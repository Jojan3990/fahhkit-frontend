import { useCallback, useEffect, useRef } from 'react'

// The Screen Wake Lock is released automatically by the browser when the tab
// is hidden, so it has to be re-requested on visibilitychange — otherwise the
// screen can sleep mid-run after the user briefly switches apps.
export function useWakeLock() {
  const sentinelRef = useRef(null)
  const wantLockRef = useRef(false)

  const request = useCallback(async () => {
    wantLockRef.current = true
    if (!('wakeLock' in navigator)) return
    try {
      sentinelRef.current = await navigator.wakeLock.request('screen')
    } catch {
      // Denied or unsupported in this context — tracking still works, screen may just sleep.
    }
  }, [])

  const release = useCallback(async () => {
    wantLockRef.current = false
    try {
      await sentinelRef.current?.release()
    } catch {
      // no-op
    }
    sentinelRef.current = null
  }, [])

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible' && wantLockRef.current) {
        request()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [request])

  useEffect(() => () => release(), [release])

  return { request, release }
}
