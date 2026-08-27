import { getJson, postJson, deleteJson } from './client'

export function getRuns() {
  return getJson('/v1/run')
}

export function getRun(id) {
  return getJson(`/v1/run/${id}`)
}

export function createRun(data) {
  return postJson('/v1/run', data)
}

export function deleteRun(id) {
  return deleteJson(`/v1/run/${id}`)
}
