import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  darkMode: boolean;
  soundOn: boolean;
}

const initialState: SettingsState = {
  darkMode: true,
  soundOn: true,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    toggleSound: (state) => {
      state.soundOn = !state.soundOn;
    },
    setSound: (state, action: PayloadAction<boolean>) => {
      state.soundOn = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode, toggleSound, setSound } =
  settingsSlice.actions;

export default settingsSlice.reducer;
