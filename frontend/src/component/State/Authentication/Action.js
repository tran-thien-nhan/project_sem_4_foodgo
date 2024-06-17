import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType";
import { API_URL, api } from "../../Config/api";
import axios from "axios";

export const registerUser = (reqData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData); // nghĩa là gửi request POST tới đường dẫn http://localhost:5454/auth/signup với dữ liệu reqData
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
        }

        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurant");
        }
        else {
            reqData.navigate("/");
        }

        dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
        console.log("REGISTER SUCCESS: ", data);

    } catch (error) {
        dispatch({ type: REGISTER_FAILURE, payload: error });
        console.log("ERROR: ", error);
        
    }
}

export const loginUser = (reqData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.userData); // nghĩa là gửi request POST tới đường dẫn http://localhost:5454/auth/signup với dữ liệu reqData
        if (data.jwt) { // nếu có jwt thì lưu vào localStorage
            localStorage.setItem("jwt", data.jwt);
        }

        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurant");
        }
        else {
            reqData.navigate("/");
        }

        dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
        console.log("LOGIN SUCCESS: ", data);

    } catch (error) {
        dispatch({ type: LOGIN_FAILURE, payload: error });
        console.log("ERROR: ", error);
        
    }
}

export const getUser = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
        const { data } = await api.get(`/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`, // gửi jwt token trong header
            },
        });

        dispatch({ type: GET_USER_SUCCESS, payload: data });
        console.log("USER PROFILE: ", data);

    } catch (error) {
        dispatch({ type: GET_USER_FAILURE, payload: error});
        console.log("ERROR: ", error);
        
    }
}

export const addToFavorite = ({ jwt, restaurantId }) => async (dispatch) => {
    
    try {
        const { data } = await api.put(`/api/restaurants/${restaurantId}/add-to-favorites`, {}, {
            headers: {
                Authorization: `Bearer ${jwt}`, // gửi jwt token trong header
            },
        });

        dispatch({ type: ADD_TO_FAVORITE_SUCCESS, payload: data });
        console.log("ADD TO FAVORITE: ", data);

    } catch (error) {
        dispatch({ type: ADD_TO_FAVORITE_FAILURE, payload: error});
        console.log("ERROR: ", error);
        
    }
}

export const logOut = () => async (dispatch) => {
    //dispatch({ type: LOGOUT });
    try {
        localStorage.clear();
        dispatch({ type: LOGOUT });
        //console.log("LOGOUT: ", data);

    } catch (error) {
        console.log("ERROR: ", error);
        
    }
}