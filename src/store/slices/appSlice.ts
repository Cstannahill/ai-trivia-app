import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RunStatus =
  | "idle"
  | "queued"
  | "in_progress"
  | "completed"
  | "failed"
  | null;

interface AppState {
  threadId: string | null;
  runId: string | null;
  runStatus: RunStatus;
  sessionId: string | null;
}

const initialState: AppState = {
  threadId: null,
  runId: null,
  runStatus: null,
  sessionId: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setThreadId: (state, action: PayloadAction<string | null>) => {
      state.threadId = action.payload;
    },
    setRunId: (state, action: PayloadAction<string | null>) => {
      state.runId = action.payload;
    },
    setRunStatus: (state, action: PayloadAction<RunStatus>) => {
      state.runStatus = action.payload;
    },
    setSessionId: (state, action: PayloadAction<string | null>) => {
      state.sessionId = action.payload;
    },
    resetAppState: () => initialState,
  },
});

export const {
  setThreadId,
  setRunId,
  setRunStatus,
  setSessionId,
  resetAppState,
} = appSlice.actions;

export default appSlice.reducer;
