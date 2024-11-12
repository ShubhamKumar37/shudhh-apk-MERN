import { setAppData } from "../../slices/appSlice";
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
            return error;
        }
    }
}

export function getApp(id)
{
    return async(dispatch) => {
        try 
        {
            const response = await apiConnector("GET", GET_SINGLE_APP, {appId: id});
            console.log("This is response: ", response.data.data);
            return response;
        }
        catch(error)
        {
            console.log("Error in getting all App: ", error);
            return error;
        }
    }
}