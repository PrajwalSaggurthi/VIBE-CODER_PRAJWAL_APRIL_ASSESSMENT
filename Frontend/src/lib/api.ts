/* API client — fetch wrapper with auth headers, refresh logic, and error handling. */

import { API_URL } from "./constants";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./auth";
import type { TokenResponse } from "@/types/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(auth = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (auth) {
      const token = getAccessToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Try to refresh
      const refreshed = await this.tryRefresh();
      if (!refreshed) {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Session expired");
      }
      throw new Error("RETRY");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "An error occurred" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  private async tryRefresh(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return false;

      const data: TokenResponse = await response.json();
      setTokens(data.access_token, data.refresh_token);
      return true;
    } catch {
      return false;
    }
  }

  async get<T>(path: string, auth = true): Promise<T> {
    const headers = await this.getHeaders(auth);
    const response = await fetch(`${this.baseUrl}${path}`, { headers });

    try {
      return await this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof Error && e.message === "RETRY") {
        const retryHeaders = await this.getHeaders(auth);
        const retryResponse = await fetch(`${this.baseUrl}${path}`, { headers: retryHeaders });
        return this.handleResponse<T>(retryResponse);
      }
      throw e;
    }
  }

  async post<T>(path: string, body?: unknown, auth = true): Promise<T> {
    const headers = await this.getHeaders(auth);
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    try {
      return await this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof Error && e.message === "RETRY") {
        const retryHeaders = await this.getHeaders(auth);
        const retryResponse = await fetch(`${this.baseUrl}${path}`, {
          method: "POST",
          headers: retryHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });
        return this.handleResponse<T>(retryResponse);
      }
      throw e;
    }
  }

  async put<T>(path: string, body?: unknown, auth = true): Promise<T> {
    const headers = await this.getHeaders(auth);
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    try {
      return await this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof Error && e.message === "RETRY") {
        const retryHeaders = await this.getHeaders(auth);
        const retryResponse = await fetch(`${this.baseUrl}${path}`, {
          method: "PUT",
          headers: retryHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });
        return this.handleResponse<T>(retryResponse);
      }
      throw e;
    }
  }

  async delete(path: string, auth = true): Promise<void> {
    const headers = await this.getHeaders(auth);
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers,
    });

    try {
      await this.handleResponse<void>(response);
    } catch (e) {
      if (e instanceof Error && e.message === "RETRY") {
        const retryHeaders = await this.getHeaders(auth);
        const retryResponse = await fetch(`${this.baseUrl}${path}`, {
          method: "DELETE",
          headers: retryHeaders,
        });
        await this.handleResponse<void>(retryResponse);
        return;
      }
      throw e;
    }
  }
}

export const api = new ApiClient(API_URL);
