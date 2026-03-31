const TOKEN_KEY = "en1090_access_token";
const REFRESH_TOKEN_KEY = "en1090_refresh_token";
const AUTH_CHANGE = "en1090-auth-change";

function notifyAuthChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(params: {
  accessToken: string;
  refreshToken?: string | null;
}): void {
  window.localStorage.setItem(TOKEN_KEY, params.accessToken);
  if (params.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  notifyAuthChange();
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  notifyAuthChange();
}

export function subscribeAuth(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === TOKEN_KEY || e.key === REFRESH_TOKEN_KEY || e.key === null) cb();
  };
  const onLocal = () => cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_CHANGE, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_CHANGE, onLocal);
  };
}

export { TOKEN_KEY, REFRESH_TOKEN_KEY };
