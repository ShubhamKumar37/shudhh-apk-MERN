import axios from "axios";

export const axiosInstance = axios.create({ withCredentials: true });
// To set the cookie on frontend as well we have to use this withCredentials: true
 

export const apiConnector = async (method, url, bodyData, headers, params ) =>
{
    return await axiosInstance({
        method: method,
        url: url,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}