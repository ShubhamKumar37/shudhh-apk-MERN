import { useNavigate } from "react-router-dom";
import { setLoading, setSignupData, setToken } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { userAuth } from "../apis";

const {SIGNUP_USER, SEND_OTP_USER} = userAuth;


export function signup({name, email, password, confirmPassword, otp}, navigate)
{
    return async(dispatch) =>
    {
        try
        {
            dispatch(setLoading(true));
            console.log("Signup Data: ", { name, email, password, confirmPassword, otp });
            const response = await apiConnector("POST", SIGNUP_USER, { name, email, password, confirmPassword, otp });
            console.log("This is Signup response: ", response);
            dispatch(setLoading(false));
            dispatch(setSignupData(null));
            
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
        const response = await apiConnector("POST", SEND_OTP_USER, { email });
        console.log("This is sendOTP response: ", response);
        return response;
    }
    catch(error)
    {
        console.log("Error: ", error);
    }
}