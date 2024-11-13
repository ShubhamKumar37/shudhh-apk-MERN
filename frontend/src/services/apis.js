const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

// APP AREA OF APIS ENDPOINT
export const appApi = {
    CREATE_APP: BASE_URL + "/app/create-app",
    GET_ALL_APPS: BASE_URL + "/app/get-all-apps",
    GET_SINGLE_APP: BASE_URL + "/app/get-app",
    DELETE_APP: BASE_URL + "/app/delete-app",
    UPDATE_APP: BASE_URL + "/app/update-app",
    UPDATE_MAIN_FILE: BASE_URL + "/app/update-file",
    UPDATE_MEDIA: BASE_URL + "/app/update-media",
};

// CATEGORY AREA OF APIS ENDPOINT
export const categoryApi = {
    CREATE_CATEGORY: BASE_URL + "/category/create-categories",
    GET_ALL_CATEGORIES: BASE_URL + "/category/get-all-categories",
};

// USER AUTH APIS ENDPOINT
export const userAuth = {
    SIGNUP_USER: BASE_URL + "/auth/signup",
    LOGIN_USER: BASE_URL + "/auth/login",
    SEND_OTP_USER: BASE_URL + "/auth/sendOTP",
    RESET_PASSWORD_USER: BASE_URL + "/auth/reset-password",
    RESET_PASSWORD_TOKEN_USER: BASE_URL + "/auth/reset-password-token",
};

