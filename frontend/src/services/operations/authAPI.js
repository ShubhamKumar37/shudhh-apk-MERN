import { setLoading, setSignupData, setToken, setUserData } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { userAuth } from "../apis";

const {SIGNUP_USER, SEND_OTP_USER, LOGIN_USER} = userAuth;


export function signup({name, email, password, confirmPassword, otp}, navigate)
{
    return async(dispatch) =>
    {
        try
        {
            dispatch(setLoading(true));
            console.log("Signup Data: ", { name, email, password, confirmPassword, otp });
            const response = await apiConnector("POST", SIGNUP_USER, { name, email, password, confirmPassword, otp });
            console.log("This is Signup response: ", response.data);
            dispatch(setLoading(false));
            dispatch(setSignupData(null));

            if(!response.data.success)
            {
                alert(response.data.message);
                return ;
            }
            
            navigate("/login");
        }
        catch(error)
        {
            dispatch(setLoading(false));
            console.log("Error: ", error.response.data);
        }
    }
}

export async function sendOTP(email)
{
    try
    {
        console.log("Aya hu OTP k lia");
        const response = await apiConnector("POST", SEND_OTP_USER, { email });
        if(!response.data.success)
        {
            alert(response.data.message);
            return ;
        }
        console.log("This is sendOTP response: ", response);
        return response;
    }
    catch(error)
    {
        console.log("Error: ", error);
    }
}

export function login({email, password}, navigate)
{
    return async(dispatch) =>
    {
        try
        {
            setLoading(true);
            console.log("Yaha bhi aya hun");
            const response = await apiConnector("PUT", LOGIN_USER, { email, password });
            console.log("This is user login response: ", response.data);
            console.log("This is user login response: ", response.data.token);

            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem("userData", JSON.stringify(response.data.userExist));
            
            dispatch(setToken(response.data.token));
            dispatch(setUserData(response.data.userExist));
            dispatch(setLoading(false));
            navigate("/");
        }
        catch(Error)
        {
            console.log("Error: ", Error);
        }
    }
}

export function logout(navigate)
{
    return async(dispatch) =>
    {
        try
        {
            dispatch(setLoading(true));
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            localStorage.clear();
            dispatch(setToken(null));
            dispatch(setUserData(null));
            dispatch(setLoading(false));
            navigate("/");
        }
        catch(Error)
        {
            console.log("Error: ", Error);
        }
    }
}
