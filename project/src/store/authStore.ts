import { create } from "zustand";
import axios from "axios";
import { User } from "../types/user";
import { toast } from "react-hot-toast";
import { User } from "lucide-react";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signin: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      console.log("user response",response)
      set({ user: response.data.user });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  signin: async (name, email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        }
      );
      toast.success("Account Created Successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  logout: () => {
    set({ user: null });
    toast.success("Logged out successfully");
  },
}));
