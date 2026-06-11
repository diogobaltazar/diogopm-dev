const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'

export async function fetchCvVersion(): Promise<string> {
  const res = await fetch(`${API_BASE}/cv/version`)
  if (!res.ok) throw new Error(`Version fetch failed (${res.status})`)
  const { version } = (await res.json()) as { version: string }
  return version
}

export async function requestCvPdf(token: string, email: string): Promise<{ download_url: string; version: string }> {
  const res = await fetch(`${API_BASE}/cv/request`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Request failed (${res.status}): ${detail || res.statusText}`)
  }

  const version = res.headers.get('X-CV-Version') ?? ''
  const blob = await res.blob()
  const download_url = URL.createObjectURL(blob)
  return { download_url, version }
}
