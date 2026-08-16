import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store"; // Adjust path as needed
import { IUser } from "../user/userSlice";
import { logout } from "../auth/authSlice";



// Define the state type
type TAllUserState = {
  users: IUser[];
};

// Initial state
const initialState: TAllUserState = {
  users: [],
};

// Create the slice
const allUserSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    // Reducer to set all users
    setAllUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Clear all-users data (admin-only PII) whenever the user logs out,
    // so it can't linger in memory for a different user in the same session.
    builder.addCase(logout, () => initialState);
  },
});

// Export actions and reducer
export const { setAllUsers } = allUserSlice.actions;
export default allUserSlice.reducer;

// Selector to get all users from state
export const selectAllUsers = (state: RootState) => state.allUsers.users;