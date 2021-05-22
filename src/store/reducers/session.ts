import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SessionState {
  user: string;
  token: string;
}

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    user: null,
    token: null
  },
  reducers: {
    setUser: (state, user: PayloadAction<string>) => {
      return {
        ...state,
        user: user.payload
      };
    },
    setToken: (state, token: PayloadAction<string>) => {
      return {
        ...state,
        token: token.payload
      };
    }
  }
});

// Action creators are generated for each case reducer function
export const { setUser, setToken } = sessionSlice.actions;

export default sessionSlice.reducer;
