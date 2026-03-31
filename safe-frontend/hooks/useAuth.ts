"use client";

import {
  clearToken,
  getRefreshToken,
  getToken,
  setTokens,
  subscribeAuth,
} from "@/lib/auth-storage";
import { useRouter } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";

export function useAuth() {
  const router = useRouter();
  const accessToken = useSyncExternalStore(
    subscribeAuth,
    () => getToken(),
    () => null
  );

  const refreshToken = useSyncExternalStore(
    subscribeAuth,
    () => getRefreshToken(),
    () => null
  );

  const login = useCallback((params: { accessToken: string; refreshToken?: string | null }) => {
    setTokens(params);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    router.replace("/login");
  }, [router]);

  return {
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(accessToken),
    login,
    logout,
  };
}
