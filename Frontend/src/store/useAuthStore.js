import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

import { io } from "socket.io-client";
const BASE_URL = "http://localhost:3333";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket:null,



  // ✅ Check authentication
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket()

    } catch (error) {
      console.log("CheckAuth error:", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ Signup
  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data }); // ✅ FIXED
      toast.success("Account created successfully");
      get().connectSocket()

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ Login
  login: async (data) => {
    set({ isLoggingIng: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data }); // ✅ FIXED
      toast.success("Logged in successfully");
       get().connectSocket()

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIng: false });
    }
  },

  // ✅ Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // ✅ Update Profile
 updateProfile: async (data) => {
  set({ isUpdatingProfile: true });
  try {
    const res = await axiosInstance.put("/auth/update-profile", data); // ✅ correct route
    set({ authUser: res.data });
    toast.success("Profile updated successfully");
    return true; // ✅ return success
  } catch (error) {
    console.log("error in update profile", error);
    toast.error(error.response?.data?.message || "Update failed");
    return false; // ✅ return false on failure
  } finally {
    set({ isUpdatingProfile: false });
  }
},

connectSocket: () => {
  const { authUser } = get();
  const socket = get().socket;

  if (!authUser || socket?.connected) return;

  const newSocket = io(BASE_URL, {
    query: {
      userId: authUser._id,
    },
  });

  newSocket.connect();

  set({ socket: newSocket });

  newSocket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds });
  });
},

disconnectSocket :()=>{
  if (get().socket?.connected) get().socket.disconnect();
}

}));
