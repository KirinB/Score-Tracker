import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  mode: ThemeMode;
  isMinimal: boolean;
}

const THEME_KEY = "app_theme";
const MINIMAL_KEY = "app_minimal";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark"; // Default là dark cho đẹp
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "dark" || saved === "light" ? saved : "dark";
};

const getInitialMinimal = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MINIMAL_KEY) === "true";
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
  isMinimal: getInitialMinimal(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // --- DARK/LIGHT MODE ---
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      localStorage.setItem(THEME_KEY, action.payload);
    },
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, state.mode);
    },

    // --- MINIMAL MODE ---
    setIsMinimal(state, action: PayloadAction<boolean>) {
      state.isMinimal = action.payload;
      localStorage.setItem(MINIMAL_KEY, String(action.payload));
    },
    toggleMinimal(state) {
      state.isMinimal = !state.isMinimal;
      localStorage.setItem(MINIMAL_KEY, String(state.isMinimal));
    },
  },
});

export const { setTheme, toggleTheme, setIsMinimal, toggleMinimal } =
  themeSlice.actions;
export default themeSlice.reducer;
