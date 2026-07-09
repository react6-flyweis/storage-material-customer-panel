import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  firstName: string;
  email: string;
  customerId: string;
  photo: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        customer: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.customer;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string | null;
        refreshToken?: string | null;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;

      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginSuccess, updateTokens, logout, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
