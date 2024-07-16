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
} from "./ActionType";

// Action creator for registering a driver
export const registerDriver = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: REGISTER_DRIVER_REQUEST });
        try {
            const { data } = await api.post('/api/admin/shipper/register', reqData);
            dispatch({ type: REGISTER_DRIVER_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: REGISTER_DRIVER_FAILURE, payload: error.message });
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
            console.log("DRIVER PROFILE: ",data);
        } catch (error) {
            dispatch({ type: GET_DRIVER_PROFILE_FAILURE, payload: error.message });
            console.log("ERROR: ", error);
        }
    }
}

// Action creator for getting driver's current ride
export const getDriverCurrentRide = (driverId, token) => {
    return async (dispatch) => {
        dispatch({ type: GET_DRIVER_CURRENT_RIDE_REQUEST });
        try {
            const { data } = await api.get(`/api/admin/shipper/${driverId}/currentRide`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: GET_DRIVER_CURRENT_RIDE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_DRIVER_CURRENT_RIDE_FAILURE, payload: error.message });
        }
    }
}

// Action creator for getting allocated rides
export const getAllocatedRides = (driverId, token) => {
    return async (dispatch) => {
        dispatch({ type: GET_ALLOCATED_RIDES_REQUEST });
        try {
            const { data } = await api.get(`/api/admin/shipper/${driverId}/allocatedRides`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: GET_ALLOCATED_RIDES_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_ALLOCATED_RIDES_FAILURE, payload: error.message });
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
