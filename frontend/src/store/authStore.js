import {create} from "zustand";
import axios from "axios";

//Global state management hook 
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: true,
    error: null,
    //Signup function
    signup: async(email, password, name) => {
        set({ isLoading: true});
        try {
            //API request and response data
            const response = await axios.post("/api/auth/signup", {email, password, name});
            set({ user: response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            //Error handling
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    }
}))