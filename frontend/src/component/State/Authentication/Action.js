import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE } from "./ActionType";
import { API_URL, api } from "../../Config/api";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { getEventsByRestaurant, getFavoritesEvents } from "../Event/Action";
import { getAllRestaurantsPublicAction } from "../Restaurant/Action";

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
            if (data.message != "Sign In successfully") {
                toast.success('register successfully! Please Check Your Email', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            }

            // reqData.navigate("/");
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
        dispatch(getFavoritesEvents({ jwt }))

    } catch (error) {
        dispatch({ type: GET_USER_FAILURE, payload: error });
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
        dispatch(getUser(jwt));
        dispatch(getFavoritesEvents(jwt));
        dispatch(getAllRestaurantsPublicAction())
        console.log("ADD TO FAVORITE: ", data);

    } catch (error) {
        dispatch({ type: ADD_TO_FAVORITE_FAILURE, payload: error });
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

export const forgotPassword = (email) => async (dispatch) => {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    try {
        await axios.post(`${API_URL}/auth/forgot-password`, { email });
        dispatch({ type: RESET_PASSWORD_SUCCESS });
        toast.success('Password reset email sent!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    } catch (error) {
        dispatch({ type: RESET_PASSWORD_FAILURE, payload: error });
        toast.error('Failed to send password reset email!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
};

export const resetPassword = ({ token, newPassword, navigate }) => async dispatch => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST })
    try {
        await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
        dispatch({ type: CHANGE_PASSWORD_SUCCESS });
        toast.success('Password has been reset successfully!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        navigate('/');
        // alert('Password has been reset successfully');
    } catch (error) {
        dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: error });
        console.error('There was an error resetting the password!', error);
        // alert('Failed to reset password');
        toast.error(error.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
};

