import { create } from "zustand";
import axiosInstance from "../config/axios.js";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,

  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post(
        "/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      set({
        authUser: res.data.user,
        isAuthenticated: true,
      });
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      set({ isAuthenticated: false });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ isSigningUp: true });

    if (password !== confirmPassword) {
      set({ isSigningUp: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      set({
        authUser: res.data.user,
        isAuthenticated: true,
      });
      toast.success("Signup successful!");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
      set({ isAuthenticated: false });
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ authUser: null, isAuthenticated: false });
    }
  },

  checkAuthStatus: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({
        authUser: res.data,
        isAuthenticated: true,
      });
    } catch {
      set({ authUser: null, isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().isCheckingAuth) return;

    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.post("/auth/refresh-token");
      set({ isCheckingAuth: false });
      return response.data;
    } catch (error) {
      set({ authUser: null, isCheckingAuth: false, isAuthenticated: false });
      throw error;
    }
  },
}));

let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }
        refreshPromise = useAuthStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
