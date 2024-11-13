import toast from "react-hot-toast";
import { setAppData, setSingleAppData } from "../../slices/appSlice";
import { apiConnector } from "../apiConnector";
import { appApi } from "../apis";

const {GET_ALL_APPS, GET_SINGLE_APP, CREATE_APP} = appApi;

export function getAllApp(){
    return async(dispatch) => {
        try {
            const response = await apiConnector("GET", GET_ALL_APPS);
            console.log("This is response: ", response.data.data);
            dispatch(setAppData(response.data.data));
            return response;
        } catch (error) {
            console.log("Error in getting all App: ", error);
        }
    }
}

export function getApp(appId) {
    return async (dispatch) => {
        try {
            const response = await apiConnector("GET", `${GET_SINGLE_APP}/${appId}`);;
            dispatch(setSingleAppData(response.data.data));
            return response.data.data;
        } catch (error) {
            console.log("Error in getting an App: ", error.response.data);
            return error;
        }
    };
}

export function createApp(data, navigate) {
    return async (dispatch) => {
        try {
            toast.loading("Creating App...");
            const response = await apiConnector("POST", CREATE_APP, data);
            console.log("This is response for creating app : ", response.data.data);
            toast.dismiss();
            toast.success("App created successfully");
            navigate("/");
            return response;

        } catch (error) {
            toast.dismiss();
            console.log("Error in creating an App: ", error.response.data);
            return error;
        }
    };
}