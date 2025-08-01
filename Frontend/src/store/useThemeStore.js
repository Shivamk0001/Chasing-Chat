import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "light",
  setTheme: (newTheme) => {
    localStorage.setItem("chat-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    console.log("Changing theme to", newTheme); // ✅ Confirm it's firing
    set({ theme: newTheme });
  },
}));
