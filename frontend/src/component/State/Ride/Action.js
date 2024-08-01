// RideActions.js
import axios from "axios";
import {
    REQUEST_RIDE, REQUEST_RIDE_SUCCESS, REQUEST_RIDE_FAILURE,
    FIND_RIDE_BY_ID_REQUEST, FIND_RIDE_BY_ID_SUCCESS, FIND_RIDE_BY_ID_FAILURE,
    ACCEPT_RIDE_REQUEST, ACCEPT_RIDE_SUCCESS, ACCEPT_RIDE_FAILURE,
    DECLINE_RIDE_REQUEST, DECLINE_RIDE_SUCCESS, DECLINE_RIDE_FAILURE,
    START_RIDE_REQUEST, START_RIDE_SUCCESS, START_RIDE_FAILURE,
    COMPLETE_RIDE_REQUEST, COMPLETE_RIDE_SUCCESS, COMPLETE_RIDE_FAILURE,
    CANCEL_RIDE_REQUEST, CANCEL_RIDE_SUCCESS, CANCEL_RIDE_FAILURE,
    FIND_ALL_RIDE_REQUEST,
    FIND_ALL_RIDE_SUCCESS,
    FIND_ALL_RIDE_FAILURE
} from "./ActionType";
import { API_URL } from "../../Config/api";
import { Bounce, toast } from "react-toastify";
import { cancelledRides, completedRides, getAllocatedRides, getDriverCurrentRide, getDriverProfile } from "../Driver/Action";

export const requestRide = (rideRequest, jwt) => async (dispatch) => {
    dispatch({ type: REQUEST_RIDE });
    try {
        const { data } = await axios.post(`${API_URL}/api/admin/shipper/ride/request`, rideRequest, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: REQUEST_RIDE_SUCCESS, payload: data });
        console.log("request ride success: ", data);
        toast.success('request ride successfully!', {
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
        dispatch({ type: REQUEST_RIDE_FAILURE, payload: error });
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
};

export const findRideById = (id, jwt) => async (dispatch) => {
    dispatch({ type: FIND_RIDE_BY_ID_REQUEST });
    try {
        const { data } = await axios.get(`${API_URL}/api/admin/shipper/ride/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: FIND_RIDE_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FIND_RIDE_BY_ID_FAILURE, payload: error });
    }
};

export const acceptRide = (id, driverId, jwt) => async (dispatch) => {
    dispatch({ type: ACCEPT_RIDE_REQUEST });
    try {
        await axios.put(`${API_URL}/api/admin/shipper/ride/accept/${id}`, null, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: ACCEPT_RIDE_SUCCESS, payload: id });
        dispatch(getAllocatedRides({
            driverId: driverId,
            token: jwt
        }))
        dispatch(getDriverCurrentRide({
            driverId: driverId,
            token: jwt
        }))
        console.log("accept ride success");
        toast.success('ride is accepted!', {
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
        dispatch({ type: ACCEPT_RIDE_FAILURE, payload: error });
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
};

export const declineRide = (rideId, driverId, jwt) => async (dispatch) => {
    dispatch({ type: DECLINE_RIDE_REQUEST });
    try {
        await axios.put(`${API_URL}/api/admin/shipper/ride/decline/${rideId}/${driverId}`, null, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: DECLINE_RIDE_SUCCESS, payload: { rideId, driverId } });
        dispatch(getAllocatedRides({
            driverId: driverId,
            token: jwt
        }))
        dispatch(getDriverProfile(jwt))
        dispatch(cancelledRides({
            driverId: driverId,
            token: jwt
        }))
        console.log("DECLINE_RIDE_SUCCESS");
    } catch (error) {
        dispatch({ type: DECLINE_RIDE_FAILURE, payload: error });
        console.log("ERROR: ", error);
    }
};

export const startRide = ({ id, jwt, driverId }) => async (dispatch) => {
    dispatch({ type: START_RIDE_REQUEST });
    try {
        await axios.put(`${API_URL}/api/admin/shipper/ride/start/${id}`, null, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: START_RIDE_SUCCESS, payload: id });
        dispatch(getDriverCurrentRide({
            driverId: driverId,
            token: jwt
        }))
        console.log("start ride success");
    } catch (error) {
        dispatch({ type: START_RIDE_FAILURE, payload: error });
        console.log("ERROR: ", error);
    }
};

export const completeRide = ({ id, jwt, driverId, images, comment }) => async (dispatch) => {
    dispatch({ type: COMPLETE_RIDE_REQUEST });
    try {
        await axios.put(`${API_URL}/api/admin/shipper/ride/complete/${id}`, { images, comment }, {
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        });
        dispatch({ type: COMPLETE_RIDE_SUCCESS, payload: id });
        dispatch(getDriverCurrentRide({
            driverId: driverId,
            token: jwt
        }))
        dispatch(completedRides({
            driverId: driverId,
            token: jwt
        }))
        dispatch(getDriverProfile(jwt))
        console.log("complete ride success: ");
    } catch (error) {
        dispatch({ type: COMPLETE_RIDE_FAILURE, payload: error });
        console.log("ERROR: ", error);
    }
};

export const cancelRide = (id, jwt) => async (dispatch) => {
    dispatch({ type: CANCEL_RIDE_REQUEST });
    try {
        await axios.put(`${API_URL}/api/admin/shipper/ride/cancel/${id}`, null, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: CANCEL_RIDE_SUCCESS, payload: id });
        console.log("cancel ride success");
    } catch (error) {
        dispatch({ type: CANCEL_RIDE_FAILURE, payload: error });
        console.log("ERROR: ", error);
    }
};

export const findAllRide = (jwt) => async (dispatch) => {
    dispatch({ type: FIND_ALL_RIDE_REQUEST });
    try {
        const { data } = await axios.get(`${API_URL}/api/admin/shipper/ride/all`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: FIND_ALL_RIDE_SUCCESS, payload: data });
        console.log("all rides: ", data);
    }
    catch (error) {
        dispatch({ type: FIND_ALL_RIDE_FAILURE, payload: error });
        console.log("ERROR: ", error);
    }
}
