const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'

export async function requestCvPdf(token: string, email: string): Promise<{ download_url: string }> {
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

  const blob = await res.blob()
  const download_url = URL.createObjectURL(blob)
  return { download_url }
}
