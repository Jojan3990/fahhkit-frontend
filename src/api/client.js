const PRIMARY_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const FALLBACK_API_BASE_URL = import.meta.env.VITE_API_FALLBACK_URL || "";
const TOKEN_KEY = "fahhkit_token";
const USER_KEY = "fahhkit_user";
const ACTIVE_BASE_URL_KEY = "fahhkit_active_api_base_url";

function getCandidateBaseUrls() {
  const candidates = [PRIMARY_API_BASE_URL, FALLBACK_API_BASE_URL].filter(
    (url, index, arr) => url && arr.indexOf(url) === index
  );
  const cached = sessionStorage.getItem(ACTIVE_BASE_URL_KEY);
  if (cached && candidates.includes(cached)) {
    return [cached, ...candidates.filter((url) => url !== cached)];
  }
  return candidates;
}

// Tries each configured API server in turn, falling back to the next one
// only on a network-level failure (server unreachable), not on HTTP error
// responses. Remembers whichever one last worked so subsequent calls don't
// re-probe a dead server every time.
async function fetchWithFallback(path, options) {
  const candidates = getCandidateBaseUrls();
  let lastError;
  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      sessionStorage.setItem(ACTIVE_BASE_URL_KEY, baseUrl);
      return response;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function canManageEvents(user) {
  return user?.userType === "ADMIN" || user?.userType === "MODERATOR";
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(body?.errorMessage || "Something went wrong. Please try again.", response.status);
  }
  return body?.data;
}

export async function postForm(path, formData) {
  let response;
  try {
    response = await fetchWithFallback(path, {
      method: "POST",
      headers: { ...authHeaders() },
      body: formData,
    });
  } catch {
    throw new ApiError("Could not reach the server. Please try again in a moment.", 0);
  }
  return parseResponse(response);
}

export async function postJson(path, payload) {
  let response;
  try {
    response = await fetchWithFallback(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError("Could not reach the server. Please try again in a moment.", 0);
  }
  return parseResponse(response);
}

export async function getJson(path) {
  let response;
  try {
    response = await fetchWithFallback(path, {
      headers: { ...authHeaders() },
    });
  } catch {
    throw new ApiError("Could not reach the server. Please try again in a moment.", 0);
  }
  return parseResponse(response);
}
