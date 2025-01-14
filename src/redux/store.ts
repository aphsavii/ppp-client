import { configureStore } from "@reduxjs/toolkit";
import aptitudeSlice from './slices/aptitude';
import authSlice from './slices/auth/index';
import { AuthState } from "@/types/User";

interface rootState {
    aptitude: {
        selectedQuestions: number[]
    },
    auth:AuthState
}

const store = configureStore({
    reducer: {
        aptitude: aptitudeSlice,
        auth:authSlice
    }
});

export type { rootState };
export default store;