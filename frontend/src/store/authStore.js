import { create } from "zustand";
import axios from "axios";

//Global state management hook
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  //Signup function
  signup: async (email, password, name) => {
    set({ isLoading: true });
    try {
      //API request and response data
      const response = await axios.post("/api/auth/signup", {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      //Error handling
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  //Verify Email function
  verifyEmail: async (code) => {
    set({ isLoading: true });
    try {
      //API request and response data
      const response = await axios.post("/api/auth/verify-email", { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  //Check auth function
  checkAuth: async() => {
    set({isCheckingAuth: true});
    try {
      //API request and response data
      const response = await axios.post("/api/auth/check-auth");
      set({
        user: response.data,
        isAuthenticated: true,
        isCheckingAuth: false
      })
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
      })
    }
  }
}));
