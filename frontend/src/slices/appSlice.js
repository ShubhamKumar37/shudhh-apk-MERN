import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    appData: [],
    singleAppData: null,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppData: (state, action) => {
            state.appData = action.payload;
        },
        setSingleAppData: (state, action) => {
            state.singleAppData = action.payload;
        },
    },
});

export const { setAppData, setSingleAppData } = appSlice.actions;
export default appSlice.reducer;
