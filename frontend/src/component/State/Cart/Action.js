import { api } from '../../../Config/api';
import {
    FIND_CART_REQUEST,
    FIND_CART_SUCCESS,
    FIND_CART_FAILURE,
    CLEAR_CART_REQUEST,
    CLEAR_CART_SUCCESS,
    CLEAR_CART_FAILURE,
    GET_ALL_CART_ITEMS_REQUEST,
    GET_ALL_CART_ITEMS_SUCCESS,
    GET_ALL_CART_ITEMS_FAILURE,
    ADD_ITEM_TO_CART_REQUEST,
    ADD_ITEM_TO_CART_SUCCESS,
    ADD_ITEM_TO_CART_FAILURE,
    UPDATE_CART_ITEM_REQUEST,
    UPDATE_CART_ITEM_SUCCESS,
    UPDATE_CART_ITEM_FAILURE,
    REMOVE_CART_ITEM_REQUEST,
    REMOVE_CART_ITEM_SUCCESS,
    REMOVE_CART_ITEM_FAILURE,
} from './ActionType';

export const findCart = (token) => {
    return async (dispatch) => {
        dispatch({ type: FIND_CART_REQUEST });
        try {
            const response = await api.get(`/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: FIND_CART_SUCCESS, payload: response.data });
            console.log("FIND CART SUCCESS: ", response.data);
        }
        catch (error) {
            dispatch({ type: FIND_CART_FAILURE, payload: error });
            console.log("FIND CART FAILURE: ", error);
        }
    }
}

export const getAllCartItems = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_CART_ITEMS_REQUEST });
        try {
            const response = await api.get(`/api/cart/${reqData.cartId}/items`,
                {
                    headers: {
                        Authorization: `Bearer ${reqData.token}`,
                    },
                }
            );
            dispatch({ type: GET_ALL_CART_ITEMS_SUCCESS, payload: response.data });
            console.log("GET ALL CART ITEMS SUCCESS: ", response.data);
        }
        catch (error) {
            dispatch({ type: GET_ALL_CART_ITEMS_FAILURE, payload: error });
            console.log("GET ALL CART ITEMS FAILURE: ", error);
        }
    }
}

export const updateCartItem = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_CART_ITEM_REQUEST });
        try {
            const { data } = await api.put(`/api/cart-item/update`, reqData.data,
                {
                    headers: {
                        Authorization: `Bearer ${reqData.jwt}`,
                    },
                }
            );
            dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data });
            console.log("UPDATE CART ITEM SUCCESS: ", data);
        }
        catch (error) {
            dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error.message });
            console.log("UPDATE CART ITEM FAILURE: ", error);
        }
    }
}

export const removeCartItem = ({ cartItemId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: REMOVE_CART_ITEM_REQUEST });
        try {
            const { data } = await api.delete(`/api/cart-item/${cartItemId}/remove`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: cartItemId });
            console.log("REMOVE CART ITEM SUCCESS: ", data);
        }
        catch (error) {
            dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: error.message });
            console.log("REMOVE CART ITEM FAILURE: ", error);
        }
    }
}

export const clearCartAction = (token) => {
    return async (dispatch) => {
        dispatch({ type: CLEAR_CART_REQUEST });
        try {
            const { data } = await api.put(`/api/cart/clear`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            dispatch({ type: CLEAR_CART_SUCCESS, payload: data });
            console.log("CLEAR CART SUCCESS: ", data);
        }
        catch (error) {
            dispatch({ type: CLEAR_CART_FAILURE, payload: error.message });
            console.log("CLEAR CART FAILURE: ", error);
        }
    }
}