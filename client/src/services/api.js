import axios from "axios";












const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "").trim();

const api = axios.create({
  baseURL: apiBaseUrl || undefined,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json"
  }
});

const endpoints = {
  liveMatches: "/matches/live",
  matches: "/matches",
  matchDetails: (id) => `/matches/${id}`,
  results: "/results",
  standings: "/standings",
  news: "/news"
};

function ensureApiConfigured() {
  if (!apiBaseUrl) {
    throw new Error("VITE_API_URL is not configured.");
  }
}

function unwrap(
response,
collectionKey)
{
  const payload = response.data;
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  if (collectionKey && payload && typeof payload === "object" && collectionKey in payload) {
    return payload[collectionKey];
  }

  return payload;
}

export async function getLiveMatches() {
  ensureApiConfigured();
  return unwrap(await api.get(endpoints.liveMatches), "matches");
}

export async function getMatches() {
  ensureApiConfigured();
  return unwrap(await api.get(endpoints.matches), "matches");
}

export async function getMatchDetails(id) {
  ensureApiConfigured();
  return unwrap(await api.get(endpoints.matchDetails(id)), "match");
}

export async function getResults() {
  ensureApiConfigured();
  return unwrap(await api.get(endpoints.results), "results");
}

export async function getStandings() {
  ensureApiConfigured();
  return unwrap(await api.get(endpoints.standings), "standings");
}

export async function getNews() {
  ensureApiConfigured();
  return unwrap(await api.get(endpoints.news), "news");
}

export { api };