import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    appData: [null],
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppData: (state, action) => {
            state.appData = action.payload;
        },
    },
});

export const { setAppData } = appSlice.actions;
export default appSlice.reducer;
