import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

// Define the User interface
export interface IUser {
  _id?: string
  name: string;
  email: string;
  address: string;
  phone: string;
  role?:string
}

// Define the state type
export type TUserState = {
  user: IUser | null;
  loading: boolean;
  error: string | null;
};

// Initial state
const initialState: TUserState = {
  user: null,
  loading: false,
  error: null,
};

// Create the user slice
const userSlice = createSlice({
  name: "user", // still named user
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  setUser,
  setUserLoading,
  setUserError,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
