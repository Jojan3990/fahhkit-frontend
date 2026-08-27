/* eslint-disable react/prop-types -- no prop-types dependency in this project */
// TEMP — testing only, remove when told to (see RunsPage.jsx usage too).
// The runs list endpoint only returns summary fields, so this fetches each
// run's own detail just to get its points for a small map preview.
import { useEffect, useState } from 'react'
import { getRun } from '../api/runs'
import RunMap from './RunMap'
import './RunThumbnailMap.css'

export default function RunThumbnailMap({ runId }) {
  const [points, setPoints] = useState(null)

  useEffect(() => {
    let cancelled = false
    getRun(runId)
      .then((data) => {
        if (!cancelled) setPoints(data.points || [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [runId])

  if (!points || points.length === 0) return null

  return (
    <div className="run-thumbnail-map">
      <RunMap points={points} />
    </div>
  )
}
