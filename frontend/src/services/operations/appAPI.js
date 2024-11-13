import { setAppData, setSingleAppData } from "../../slices/appSlice";
import { apiConnector } from "../apiConnector";
import { appApi } from "../apis";

const {GET_ALL_APPS, GET_SINGLE_APP} = appApi;

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
            const response = await apiConnector("GET", `${GET_SINGLE_APP}/${appId}`);
            console.log("This is response: ", response.data.data);
            dispatch(setSingleAppData(response.data.data));
            return response.data.data;
        } catch (error) {
            console.log("Error in getting an App: ", error.response.data);
            return error;
        }
    };
}
