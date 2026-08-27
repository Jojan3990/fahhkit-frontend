// Points noisier than this (in meters) are dropped client-side, mirroring the
// backend's MAX_ACCEPTABLE_ACCURACY_METERS so the live distance shown during a
// run matches what actually gets stored.
export const MAX_ACCEPTABLE_ACCURACY_METERS = 20

const EARTH_RADIUS_METERS = 6371000

export function haversineDistance(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h))
}

export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds || 0))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`
}

export function formatDistance(meters) {
  if (meters == null || Number.isNaN(meters)) return '--'
  return `${(meters / 1000).toFixed(2)} km`
}

// avgPace is minutes per km (matches RunSummaryResponse/RunDetailResponse.avgPace)
export function formatPace(minutesPerKm) {
  if (!minutesPerKm || !Number.isFinite(minutesPerKm)) return '--'
  const totalSeconds = Math.round(minutesPerKm * 60)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')} /km`
}

export function calculatePaceMinPerKm(distanceMeters, durationSeconds) {
  if (!distanceMeters || distanceMeters <= 0 || !durationSeconds) return null
  const distanceKm = distanceMeters / 1000
  return durationSeconds / 60 / distanceKm
}

export function formatRunDate(value) {
  if (!value) return '--'
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const ACTIVE_RUN_STORAGE_KEY = 'fahhkit_active_run'

// Persists the in-progress run so a page refresh (or the tab being reopened)
// can resume tracking instead of losing everything collected so far.
export function saveActiveRun(record) {
  try {
    localStorage.setItem(ACTIVE_RUN_STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Storage full/unavailable — tracking still works for this page load, it just won't survive a refresh.
  }
}

export function loadActiveRun() {
  try {
    const raw = localStorage.getItem(ACTIVE_RUN_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.startedAt ? parsed : null
  } catch {
    return null
  }
}

export function clearActiveRun() {
  try {
    localStorage.removeItem(ACTIVE_RUN_STORAGE_KEY)
  } catch {
    // no-op
  }
}

// Serializes to the same offset-less "yyyy-MM-ddTHH:mm:ss" shape the backend's
// LocalDateTime fields expect (see the datetime-local inputs on CreateEventPage) —
// Date#toISOString() appends a "Z"/UTC offset that Jackson's default LocalDateTime
// deserializer rejects.
export function toLocalDateTimeString(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  )
}
