"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { api } from "@/lib/api";
import { setTokens, clearTokens, isAuthenticated, getTokenPayload } from "@/lib/auth";
import type { TokenResponse } from "@/types/api";
import type { Tenant } from "@/types/tenant";

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: { id: string; email: string; role: string; tenant_id: string } | null;
  tenant: Tenant | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, slug: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    isLoading: true,
    user: null,
    tenant: null,
  });

  const extractUser = useCallback(() => {
    const payload = getTokenPayload();
    if (!payload) return null;
    return {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
      tenant_id: payload.tenant_id as string,
    };
  }, []);

  const fetchTenant = useCallback(async () => {
    try {
      const tenant = await api.get<Tenant>("/tenant");
      return tenant;
    } catch {
      return null;
    }
  }, []);

  const refreshTenant = useCallback(async () => {
    const tenant = await fetchTenant();
    setState((prev) => ({ ...prev, tenant }));
  }, [fetchTenant]);

  // Check auth on mount
  useEffect(() => {
    const init = async () => {
      if (isAuthenticated()) {
        const user = extractUser();
        const tenant = await fetchTenant();
        setState({ isLoggedIn: true, isLoading: false, user, tenant });
      } else {
        setState({ isLoggedIn: false, isLoading: false, user: null, tenant: null });
      }
    };
    init();
  }, [extractUser, fetchTenant]);

  const login = async (email: string, password: string) => {
    const data = await api.post<TokenResponse>("/auth/login", { email, password }, false);
    setTokens(data.access_token, data.refresh_token);
    const user = extractUser();
    const tenant = await fetchTenant();
    setState({ isLoggedIn: true, isLoading: false, user, tenant });
  };

  const register = async (name: string, slug: string, email: string, password: string) => {
    const data = await api.post<TokenResponse>("/auth/register", { name, slug, email, password }, false);
    setTokens(data.access_token, data.refresh_token);
    const user = extractUser();
    const tenant = await fetchTenant();
    setState({ isLoggedIn: true, isLoading: false, user, tenant });
  };

  const logout = () => {
    clearTokens();
    setState({ isLoggedIn: false, isLoading: false, user: null, tenant: null });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshTenant }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
