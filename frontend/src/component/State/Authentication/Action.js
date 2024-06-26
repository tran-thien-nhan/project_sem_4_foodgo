import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType";
import { API_URL, api } from "../../Config/api";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

export const registerUser = (reqData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData); // nghĩa là gửi request POST tới đường dẫn http://localhost:5454/auth/signup với dữ liệu reqData
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
        }

        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurants");
        }
        else {
            toast.success('register successfully!', {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
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

            toast.success('Login successfully!', {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }

        if (data.role === "ROLE_RESTAURANT_OWNER") {
            reqData.navigate("/admin/restaurants");            
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
    try {
        localStorage.clear();
        dispatch({ type: LOGOUT });
        //window.location.href = "/";

    } catch (error) {
        console.log("ERROR: ", error);
        
    }
}