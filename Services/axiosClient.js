import { createAxiosClient } from "./createAxiosClient";
const REFRESH_TOKEN_URL = 'https://nanoapp-api.herokuapp.com/api/token/refresh/'
const BASE_URL = 'https://nanoapp-api.herokuapp.com/api/'


export const client = createAxiosClient({
    options: {
        baseURL: BASE_URL,
        timeout: 300000,
        headers: {
            "Content-Type": "multipart/form-data",
            "accept": "application/json" 
            //'Content-Type': 'application/json',
        }
    },
   
})


