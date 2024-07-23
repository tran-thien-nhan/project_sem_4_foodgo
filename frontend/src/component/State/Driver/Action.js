import { api } from "../../Config/api";
import {
    REGISTER_DRIVER_REQUEST,
    REGISTER_DRIVER_SUCCESS,
    REGISTER_DRIVER_FAILURE,
    GET_AVAILABLE_DRIVERS_REQUEST,
    GET_AVAILABLE_DRIVERS_SUCCESS,
    GET_AVAILABLE_DRIVERS_FAILURE,
    FIND_NEAREST_DRIVER_REQUEST,
    FIND_NEAREST_DRIVER_SUCCESS,
    FIND_NEAREST_DRIVER_FAILURE,
    GET_DRIVER_PROFILE_REQUEST,
    GET_DRIVER_PROFILE_SUCCESS,
    GET_DRIVER_PROFILE_FAILURE,
    GET_DRIVER_CURRENT_RIDE_REQUEST,
    GET_DRIVER_CURRENT_RIDE_SUCCESS,
    GET_DRIVER_CURRENT_RIDE_FAILURE,
    GET_ALLOCATED_RIDES_REQUEST,
    GET_ALLOCATED_RIDES_SUCCESS,
    GET_ALLOCATED_RIDES_FAILURE,
    FIND_DRIVER_BY_ID_REQUEST,
    FIND_DRIVER_BY_ID_SUCCESS,
    FIND_DRIVER_BY_ID_FAILURE,
    COMPLETED_RIDES_REQUEST,
    COMPLETED_RIDES_SUCCESS,
    COMPLETED_RIDES_FAILURE,
    UPDATE_DRIVER_REQUEST,
    UPDATE_DRIVER_SUCCESS,
    UPDATE_DRIVER_FAILURE,
    DELETE_DRIVER_IMAGE_FAILURE,
    DELETE_DRIVER_IMAGE_SUCCESS,
    DELETE_DRIVER_IMAGE_REQUEST,
} from "./ActionType";
import { Bounce, toast } from "react-toastify";

// Action creator for registering a driver
export const registerDriver = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: REGISTER_DRIVER_REQUEST });
        try {
            const { data } = await api.post('/api/admin/shipper/register', reqData.data, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`,
                },
            });
            dispatch({ type: REGISTER_DRIVER_SUCCESS, payload: data });
            console.log("Register driver successfully: ", data);
            toast.success('register driver successfully!', {
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
        } catch (error) {
            dispatch({ type: REGISTER_DRIVER_FAILURE, payload: error.message });
            console.log("ERROR: ", error);
        }
    }
}

// Action creator for getting available drivers
export const getAvailableDrivers = (restaurantLatitude, restaurantLongitude, ride, token) => {
    return async (dispatch) => {
        dispatch({ type: GET_AVAILABLE_DRIVERS_REQUEST });
        try {
            const { data } = await api.post('/api/admin/shipper/available', { restaurantLatitude, restaurantLongitude, ride }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: GET_AVAILABLE_DRIVERS_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_AVAILABLE_DRIVERS_FAILURE, payload: error.message });
        }
    }
}

// Action creator for finding the nearest driver
export const findNearestDriver = (availableDrivers, restaurantLatitude, restaurantLongitude, token) => {
    return async (dispatch) => {
        dispatch({ type: FIND_NEAREST_DRIVER_REQUEST });
        try {
            const { data } = await api.post('/api/admin/shipper/nearest', { availableDrivers, restaurantLatitude, restaurantLongitude }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: FIND_NEAREST_DRIVER_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: FIND_NEAREST_DRIVER_FAILURE, payload: error.message });
        }
    }
}

// Action creator for getting driver profile
export const getDriverProfile = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_DRIVER_PROFILE_REQUEST });
        try {
            const { data } = await api.get('/api/admin/shipper/profile', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: GET_DRIVER_PROFILE_SUCCESS, payload: data });
            console.log("DRIVER PROFILE: ", data);
        } catch (error) {
            dispatch({ type: GET_DRIVER_PROFILE_FAILURE, payload: error.message });
            console.log("ERROR: ", error);
        }
    }
}

// Action creator for getting driver's current ride
export const getDriverCurrentRide = ({ driverId, token }) => {
    return async (dispatch) => {
        dispatch({ type: GET_DRIVER_CURRENT_RIDE_REQUEST });
        try {
            const { data } = await api.get(`/api/admin/shipper/${driverId}/current-ride`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: GET_DRIVER_CURRENT_RIDE_SUCCESS, payload: data });
            console.log("current ride: ", data);
        } catch (error) {
            dispatch({ type: GET_DRIVER_CURRENT_RIDE_FAILURE, payload: error.message });
            console.log("ERROR: ", error);
        }
    }
}

// Action creator for getting allocated rides
export const getAllocatedRides = ({ driverId, token }) => {
    return async (dispatch) => {
        dispatch({ type: GET_ALLOCATED_RIDES_REQUEST });
        try {
            const { data } = await api.get(`/api/admin/shipper/${driverId}/allocated-rides`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: GET_ALLOCATED_RIDES_SUCCESS, payload: data });
            console.log("allocated rides: ", data);
        } catch (error) {
            dispatch({ type: GET_ALLOCATED_RIDES_FAILURE, payload: error.message });
            console.log("ERROR: ", error);
        }
    }
}

// Action creator for finding a driver by ID
export const findDriverById = (driverId, token) => {
    return async (dispatch) => {
        dispatch({ type: FIND_DRIVER_BY_ID_REQUEST });
        try {
            const { data } = await api.get(`/api/admin/shipper/${driverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: FIND_DRIVER_BY_ID_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: FIND_DRIVER_BY_ID_FAILURE, payload: error.message });
        }
    }
}

// Action creator for getting completed rides
export const completedRides = (driverId, token) => {
    return async (dispatch) => {
        dispatch({ type: COMPLETED_RIDES_REQUEST });
        try {
            const { data } = await api.get(`/api/admin/shipper/${driverId}/completedRides`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: COMPLETED_RIDES_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: COMPLETED_RIDES_FAILURE, payload: error.message });
        }
    }
}

export const updateDriver = (driverId, reqData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_DRIVER_REQUEST });
        try {
            const { data } = await api.put(`/api/admin/shipper/update/${driverId}`, reqData.data, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`,
                },
            });
            dispatch({ type: UPDATE_DRIVER_SUCCESS, payload: data });
            console.log("Update driver successfully: ", data);
            toast.success('Update driver successfully!', {
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
        } catch (error) {
            dispatch({ type: UPDATE_DRIVER_FAILURE, payload: error.message });
            console.log("ERROR: ", error);
            toast.error(error.response.data.message, {
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
}

export const deleteDriverImage = (driverId, imageUrl, token) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_DRIVER_IMAGE_REQUEST });
        try {
            await api.delete(`/api/admin/shipper/${driverId}/image`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { imageUrl } // Chuyển imageUrl qua params thay vì data
            });
            dispatch({ type: DELETE_DRIVER_IMAGE_SUCCESS });
            dispatch(getDriverProfile(token));
            toast.success('Image deleted successfully!', {
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
        } catch (error) {
            dispatch({ type: DELETE_DRIVER_IMAGE_FAILURE, payload: error.message });
            console.error("ERROR:", error);
        }
    }
}
