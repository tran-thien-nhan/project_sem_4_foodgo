import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE, REQUEST_TOKEN_REQUEST, REQUEST_TOKEN_SUCCESS, REQUEST_TOKEN_FAILURE } from "./ActionType";
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
        else if (data.role === "ROLE_SHIPPER") {
            reqData.navigate("/admin/shippers");
        }
        else {
            if (data.message !== "Sign In successfully") {
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
        // dispatch(getUser(data.jwt));
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
        else if (data.role === "ROLE_SHIPPER") {
            reqData.navigate("/admin/shippers");
        }
        else {
            reqData.navigate("/");
        }

        dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
        // dispatch(getUser(data.jwt));
        console.log("LOGIN SUCCESS: ", data);

    } catch (error) {
        dispatch({ type: LOGIN_FAILURE, payload: error });
        console.log("ERROR: ", error);
        toast.error("login fail !", {
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
        // dispatch(getFavoritesEvents(jwt))

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
        toast.error(error.response.data.message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
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
        await axios.post(`${API_URL}/api/public/forgot-password`, email);
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
        console.log("ERROR SEND EMAIL FORGOT PASSWORD: ", error.response ? error.response.data : error);
        toast.error(error.response ? error.response.data.message : error.message, {
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
    dispatch({ type: CHANGE_PASSWORD_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/api/public/reset-password`, { token, newPassword });
        dispatch({ type: CHANGE_PASSWORD_SUCCESS });
        toast.success(data, {
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
    } catch (error) {
        dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: error });
        console.error('There was an error resetting the password!', error);
        toast.error(error.response?.data || 'Failed to reset password', {
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

export const requestPasswordChangingToken = (userId) => async (dispatch) => {
    dispatch({ type: REQUEST_TOKEN_REQUEST });
    try {
        await axios.post(`${API_URL}/auth/request-token`, null, { params: { userId } });
        dispatch({ type: REQUEST_TOKEN_SUCCESS });
        toast.success('Password Change Code Sent To Your Email', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
        });
    } catch (error) {
        dispatch({ type: REQUEST_TOKEN_FAILURE, payload: error });
        toast.error('Failed to send code. Please try again later', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
        });
    }
};

export const changePassword = (reqData) => async (dispatch) => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/auth/change`, reqData);
        if (data.success) {
            dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: data });
            toast.success('Password has been changed', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            window.location.href = "/";
            dispatch(logOut());
        } else {
            dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: data.message });
            toast.error(data.message, {
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
    } catch (error) {
        dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: error.message });
        toast.error('Failed to change password. Please try again later.', {
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

