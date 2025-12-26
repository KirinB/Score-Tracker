import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  mode: ThemeMode;
  isMinimal: boolean;
  soundEnabled: boolean; // Thêm trạng thái âm thanh
}

const THEME_KEY = "app_theme";
const MINIMAL_KEY = "app_minimal";
const SOUND_KEY = "app_sound"; // Thêm key cho localStorage

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "dark" || saved === "light" ? saved : "dark";
};

const getInitialMinimal = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MINIMAL_KEY) === "true";
};

// Mặc định bật âm thanh nếu chưa lưu
const getInitialSound = (): boolean => {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem(SOUND_KEY);
  // Nếu chưa bao giờ lưu (null) hoặc lưu là "false" thì trả về false
  return saved === "true";
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
  isMinimal: getInitialMinimal(),
  soundEnabled: getInitialSound(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      localStorage.setItem(THEME_KEY, action.payload);
    },
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, state.mode);
    },
    setIsMinimal(state, action: PayloadAction<boolean>) {
      state.isMinimal = action.payload;
      localStorage.setItem(MINIMAL_KEY, String(action.payload));
    },
    toggleMinimal(state) {
      state.isMinimal = !state.isMinimal;
      localStorage.setItem(MINIMAL_KEY, String(state.isMinimal));
    },
    // --- SOUND CONTROL ---
    setSoundEnabled(state, action: PayloadAction<boolean>) {
      state.soundEnabled = action.payload;
      localStorage.setItem(SOUND_KEY, String(action.payload));
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem(SOUND_KEY, String(state.soundEnabled));
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setIsMinimal,
  toggleMinimal,
  setSoundEnabled,
  toggleSound,
} = themeSlice.actions;

export default themeSlice.reducer;
