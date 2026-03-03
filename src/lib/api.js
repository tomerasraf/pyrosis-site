const BASE = '/api'

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

export const api = {
  async get(path, token) {
    const res = await fetch(`${BASE}${path}`, { headers: authHeaders(token) })
    if (!res.ok) throw await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    return res.json()
  },
  async post(path, body, token) {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    })
    if (!res.ok) throw await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    return res.json()
  },
}
