const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getEmisoras(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/emisoras/${query ? '?' + query : ''}`;
  const data = await fetchJson(url);
  return data.results || data;
}

export async function getCadenas() {
  return fetchJson(`${API_BASE}/cadenas/`);
}

export async function getCiudades() {
  return fetchJson(`${API_BASE}/ciudades/`);
}
