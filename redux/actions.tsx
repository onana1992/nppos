import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
const BASE_URL = ""

export const GET_USER = 'GET_USER';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';


export const getUser = () => {
    

   try {
       return async dispatch => {
           // const response = await axios.get(`${BASE_URL}`);
           /* if (response.data) {*/
                dispatch({
                    type: GET_USER,
                    payload: { name: "onana", prenom: "" }
                });
            /*} else {
                console.log('Unable to fetch data from the API BASE URL!');
            }*/
        };
    } catch (error) {
        // Add custom logic to handle errors
        console.log(error);
    }
};
