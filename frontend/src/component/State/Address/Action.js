// AddressActions.js
import axios from "axios";
import {
    GET_ADDRESSES_REQUEST, GET_ADDRESSES_SUCCESS, GET_ADDRESSES_FAILURE,
    ADD_ADDRESS_REQUEST, ADD_ADDRESS_SUCCESS, ADD_ADDRESS_FAILURE,
    UPDATE_ADDRESS_REQUEST, UPDATE_ADDRESS_SUCCESS, UPDATE_ADDRESS_FAILURE,
    DELETE_ADDRESS_REQUEST, DELETE_ADDRESS_SUCCESS, DELETE_ADDRESS_FAILURE
} from "./ActionType";
import { API_URL } from "../../Config/api";

export const getAddresses = (jwt) => async (dispatch) => {
    dispatch({ type: GET_ADDRESSES_REQUEST });
    try {
        const { data } = await axios.get(`${API_URL}/api/addresses/user`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: GET_ADDRESSES_SUCCESS, payload: data });
        console.log("DATA ADDRESS: ",data);
    } catch (error) {
        dispatch({ type: GET_ADDRESSES_FAILURE, payload: error });
        console.log("ERROR: ",error);
    }
};

export const addAddress = (addressData, jwt) => async (dispatch) => {
    dispatch({ type: ADD_ADDRESS_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/api/addresses/add`, { ...addressData }, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: ADD_ADDRESS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: ADD_ADDRESS_FAILURE, payload: error });
        console.log("ERROR: ",error);
    }
};

export const updateAddress = (addressId, addressData, jwt) => async (dispatch) => {
    dispatch({ type: UPDATE_ADDRESS_REQUEST });
    try {
        const { data } = await axios.put(`${API_URL}/api/addresses/update/${addressId}`, addressData, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: UPDATE_ADDRESS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_ADDRESS_FAILURE, payload: error });
        console.log("ERROR: ",error);
    }
};

export const deleteAddress = (addressId, jwt) => async (dispatch) => {
    dispatch({ type: DELETE_ADDRESS_REQUEST });
    try {
        await axios.delete(`${API_URL}/api/addresses/delete/${addressId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        dispatch({ type: DELETE_ADDRESS_SUCCESS, payload: addressId });
    } catch (error) {
        dispatch({ type: DELETE_ADDRESS_FAILURE, payload: error });
        console.log("ERROR: ",error);
    }
};
