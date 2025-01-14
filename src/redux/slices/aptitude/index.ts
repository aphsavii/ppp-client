import { createSlice } from "@reduxjs/toolkit";

interface AptiSlice {
    selectedQuestions: number[]
}

const initialState: AptiSlice = {
    selectedQuestions: []
}

const aptitudeSlice = createSlice(
    {
        name: "aptitude",
        initialState,
        reducers: {
            checkeQs: (state, action) => {
                state.selectedQuestions.push(action.payload);
                console.log(action.payload);

            },
            uncheckQs: (state, action) => {
                state.selectedQuestions = state.selectedQuestions.filter(question => question != action.payload);
            }
        }
    }
);


export const { checkeQs, uncheckQs } = aptitudeSlice.actions;
export default aptitudeSlice.reducer;