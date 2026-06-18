import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const LOCAL_STORAGE_KEY = "dummy_ecommerce_auth";

interface SavedAuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const loadAuthFromStorage = (): SavedAuthState => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        user: data.user || null,
        isAuthenticated: !!data.isAuthenticated,
      };
    }
  } catch (error) {
    console.error("Failed to load auth from localStorage", error);
  }
  return { user: null, isAuthenticated: false };
};

const saveAuthToStorage = (user: User | null, isAuthenticated: boolean) => {
  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ user, isAuthenticated })
    );
  } catch (error) {
    console.error("Failed to save auth to localStorage", error);
  }
};

const persistedAuth = loadAuthFromStorage();

const initialState: AuthState = {
  user: persistedAuth.user,
  isAuthenticated: persistedAuth.isAuthenticated,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      saveAuthToStorage(action.payload, true);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
      saveAuthToStorage(null, false);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      saveAuthToStorage(null, false);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
