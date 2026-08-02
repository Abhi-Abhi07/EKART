// User authentication state — login status, session loading, and profile data.

import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    // True while App.jsx is checking session with the server on first load.
    // ProtectedRoute waits for this to be false before deciding to redirect.
    sessionLoading: true,
  },
  reducers: {
    /** Set the authenticated user object (from login or session bootstrap). */
    setUser: (state, action) => {
      state.user = action.payload;
    },
    /** Clear user on logout or session expiry. */
    clearUser: (state) => {
      state.user = null;
    },
    /** Mark session check as complete (success or failure). */
    setSessionLoading: (state, action) => {
      state.sessionLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setSessionLoading } = userSlice.actions;
export default userSlice.reducer;