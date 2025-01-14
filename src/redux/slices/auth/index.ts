import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "@/types/User";


const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    isAdmin: false
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAdmin = action.payload.isAdmin;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.isAdmin = false;
        }
    }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;