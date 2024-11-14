import { setLoading, setSignupData, setToken, setUserData } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { userAuth } from "../apis";
import toast from "react-hot-toast";

const { SIGNUP_USER, SEND_OTP_USER, LOGIN_USER, RESET_PASSWORD_TOKEN_USER } = userAuth;


export function signup({ name, email, password, confirmPassword, otp }, navigate) {
    return async (dispatch) => {
        try {
            dispatch(setLoading(true));

            toast.loading("Signing up...");


            console.log("Signup Data: ", { name, email, password, confirmPassword, otp });
            const response = await apiConnector("POST", SIGNUP_USER, { name, email, password, confirmPassword, otp });
            console.log("This is Signup response: ", response.data);


            dispatch(setLoading(false));
            dispatch(setSignupData(null));

            toast.dismiss();
            if (!response.data.success) {
                alert(response.data.message);
                return;
            }

            toast.success("Signup successful");
            navigate("/login");
        }
        catch (error) {
            toast.dismiss();
            toast.error(error.response.data.message);
            dispatch(setLoading(false));
            console.log("Error: ", error.response.data);
        }
    }
}

export async function sendOTP(email) {
    try {
        console.log("Aya hu OTP k lia");
        toast.loading("Sending OTP...");
        const response = await apiConnector("POST", SEND_OTP_USER, { email });
        if (!response.data.success) {
            alert(response.data.message);
            return;
        }
        toast.dismiss();
        toast.success("OTP sent successfully");
        console.log("This is sendOTP response: ", response);
        return response;
    }
    catch (error) {
        toast.error("User already exist try login");
        console.log("Error: ", error);
        return error;
    }
}

export function login({ email, password }, navigate) {
    return async (dispatch) => {
        try {
            setLoading(true);
            console.log("Yaha bhi aya hun");
            toast.loading("Logging in...");
            const response = await apiConnector("PUT", LOGIN_USER, { email, password });
            if (response.data.success === true) toast.success(response.data.message);
            console.log("This is user login response: ", response.data);
            console.log("This is user login response: ", response.data.token);

            toast.dismiss();
            toast.success("Login successful");

            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem("userData", JSON.stringify(response.data.userExist));

            dispatch(setToken(response.data.token));
            dispatch(setUserData(response.data.userExist));
            dispatch(setLoading(false));
            navigate("/");
        }
        catch (Error) {
            console.log("Error: ", Error);
            toast.dismiss();
            toast.error(Error.response.data.message);
        }
    }
}

export function logout(navigate) {
    return async (dispatch) => {
        try {
            dispatch(setLoading(true));
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            localStorage.clear();
            dispatch(setToken(null));
            dispatch(setUserData(null));
            dispatch(setLoading(false));
            navigate("/");
            toast.success("Logout successfully");
        }
        catch (Error) {
            console.log("Error: ", Error);
        }
    }
}

export function resetPasswordToken(email) {
    return async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("PUT", RESET_PASSWORD_TOKEN_USER, { email });
            toast.success("Reset link sent to your email");
            dispatch(setLoading(false));
            console.log("This is resetPasswordToken response: ", response);
            return response;
        }
        catch (error) {
            toast.error("User doesnot exist");
            console.log("Error: ", error);
            return error;
        }
    }
}