import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    signupData: null,
    loading: false,
};

const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers:
        {
            setLoading: (state, value) => {
                state.loading = value.payload;
            },
            setToken: (state, value) => {
                state.token = value.payload;
            },
            setSignupData: (state, value) => {
                state.signupData = value.payload;
            },
        }
    }
);


export const {setLoading, setToken, setSignupData} = authSlice.actions;
export default authSlice.reducer;