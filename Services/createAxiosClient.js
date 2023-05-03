import axios from 'axios';
import {store, persistor} from "../redux/store";

console.log("la store refresh", store.getState().userReducer.user.user.refresh);

const getRefreshToken = ()=>{
    return store.getState().userReducer.user.user.refresh
}


const getAccessToken = () =>{
    return store.getState().userReducer.user.user.access
}


const refreshAccessToken = (newToken) =>{
    let storeUser = store.getState().userReducer.user.user;
    storeUser.access = newToken;
    console.log("refresh acces")
    const action = { type: "SIGN_IN", value:{user:storeUser} };
    store.dispatch(action)
}


const signout= ()=>{
  const action1 = { type: "SIGN_OUT", };
  store.dispatch(action1)
}



export  function createAxiosClient({
  options,
}) {

  const client = axios.create(options);

  // request interception
  client.interceptors.request.use(
    (config) => {
      if (config.authorization !== false) {
        //const token =  config?.accessToken;
        const token =  getAccessToken();  
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);



    client.interceptors.response.use(

  response => {

    return response

  },
  function (error) {
     
      console.log("errrror",error)
      const originalRequest = error.config;

    if ( 
      error.response.status === 401 &&
      originalRequest.url === 'https://nanoapp-api.herokuapp.com/api/token/refresh/'
    ) {
     
      signout();
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      console.log("refresh du token");

      return axios
        .post('https://nanoapp-api.herokuapp.com/api/token/refresh/', {
          refresh: refreshToken
        })
        .then(res => {

          console.log("res: ", res.status);
          if (res.status === 200) {

             refreshAccessToken(res.data.access)
              console.log("new token access token : ", res.data.access);

             axios.defaults.headers.common['Authorization'] =
              'Bearer ' + res.data.access;
            
             return client(originalRequest);
             

          }

        }).catch(function (error) {

              console.log("rerrot refresh", error)
              signout();
                        
        })

    }

   // return Promise.reject(error)
  }
)

  

 return client;

}
