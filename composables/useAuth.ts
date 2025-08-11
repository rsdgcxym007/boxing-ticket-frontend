import { computed } from "vue";
import { useRouter, useRuntimeConfig, useNuxtApp, navigateTo } from "nuxt/app";
import { useApi } from "./useApi";
import { useAuthStore } from "@/stores/auth";
import { collectDeviceInfo, type DeviceInfo } from "@/utils/deviceInfo";

export interface LoginCredentials {
  username: string;
  password: string;
  deviceInfo?: DeviceInfo;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number; // seconds
}

export interface AuthError extends Error {
  status?: number;
  code?: string;
}

/**
 * Enhanced authentication composable with new API integration
 */
export const useAuth = () => {
  const api = useApi();
  const authStore = useAuthStore();
  const router = useRouter();

  /**
   * Token management
   */
  const setTokenWithExpiration = (token: string, expiresIn: number) => {
    if (process.client) {
      const expirationTime = Date.now() + expiresIn * 1000;

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());

      // Set up automatic logout when token expires
      setTimeout(() => {
        logoutWithExpiration();
      }, expiresIn * 1000);
    }
  };

  const getToken = (): string | null => {
    if (!process.client) return null;

    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");

    if (!token || !expiration) return null;

    // Check if token is expired
    if (Date.now() > parseInt(expiration)) {
      logoutWithExpiration();
      return null;
    }

    return token;
  };

  const isTokenExpired = (): boolean => {
    if (!process.client) return true;

    const expiration = localStorage.getItem("tokenExpiration");
    if (!expiration) return true;

    return Date.now() > parseInt(expiration);
  };

  /**
   * Login with new API structure
   */
  const login = async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    try {
      // Collect device information
      const deviceInfo = await collectDeviceInfo();

      const requestBody = {
        username: credentials.username,
        password: credentials.password,
        deviceInfo,
      };

      const response = await fetch(
        `${useRuntimeConfig().public.apiBase}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage;
        }

        const error = new Error(errorMessage) as AuthError;
        error.status = response.status;
        throw error;
      }

      const data: LoginResponse = await response.json();

      // Store token with expiration
      setTokenWithExpiration(data.accessToken, data.expiresIn);

      // Store user data (assuming it comes with the login response)
      // You may need to adjust this based on your actual API response structure
      if ("user" in data) {
        authStore.setUser((data as any).user);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /**
   * Logout from current device
   */
  const logout = async (): Promise<void> => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${useRuntimeConfig().public.apiBase}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage and auth store
      authStore.logout();

      // Redirect to login page
      await router.push("/login");
    }
  };

  /**
   * Logout from all devices
   */
  const logoutAllDevices = async (): Promise<void> => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${useRuntimeConfig().public.apiBase}/auth/logout-all`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout all devices API error:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage and auth store
      authStore.logout();

      // Redirect to login page
      await router.push("/login");
    }
  };

  /**
   * Handle token expiration
   */
  const logoutWithExpiration = () => {
    console.log("Token expired, logging out...");
    authStore.logout();

    // Show expiration message
    if (process.client) {
      console.log("⚠️ Session expired - please login again");
      // The frontend can integrate with their existing toast system
      // For example: showToast('error', 'Your session has expired. Please login again.');
    }

    // Redirect to login page
    router.push("/login");
  };

  /**
   * Check authentication status
   */
  const isAuthenticated = computed(() => {
    const token = getToken();
    const hasUser = !!authStore.user;
    return !!token && hasUser && !isTokenExpired();
  });

  /**
   * API request interceptor for handling token expiration
   */
  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Handle 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
      logoutWithExpiration();
      throw new Error("Authentication required");
    }

    return response;
  };

  /**
   * Initialize authentication on app startup
   */
  const initializeAuth = () => {
    if (process.client) {
      authStore.initialize();

      // Check if token is expired on startup
      if (isTokenExpired()) {
        authStore.logout();
      }
    }
  };

  /**
   * Get time until token expiration
   */
  const getTimeUntilExpiration = (): number => {
    if (!process.client) return 0;

    const expiration = localStorage.getItem("tokenExpiration");
    if (!expiration) return 0;

    const remaining = parseInt(expiration) - Date.now();
    return Math.max(0, Math.floor(remaining / 1000)); // Return seconds
  };

  return {
    // Authentication methods
    login,
    logout,
    logoutAllDevices,

    // Token management
    getToken,
    isTokenExpired,
    getTimeUntilExpiration,

    // State
    isAuthenticated,

    // Utilities
    makeAuthenticatedRequest,
    initializeAuth,
  };
};
