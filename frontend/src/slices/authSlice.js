import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    userData: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
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
            setUserData: (state, value) => {
                state.userData = value.payload;
            },
        }
    }
);


export const {setLoading, setToken, setSignupData, setUserData} = authSlice.actions;
export default authSlice.reducer;