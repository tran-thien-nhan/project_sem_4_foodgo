import { api } from '../../Config/api';
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
            //dispatch(getAllCartItems({ cartId: response.data.id, token }));
            //console.log("CART ID: ", response.data.id);
            //console.log("FIND CART SUCCESS: ", response.data);
        } catch (error) {
            dispatch({ type: FIND_CART_FAILURE, payload: error });
            //console.log("FIND CART FAILURE: ", error);
        }
    }
}

export const addItemToCart = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
        try {
            const { data } = await api.put(`/api/cart/add`, reqData.cartItem, {
                headers: {
                    Authorization: `Bearer ${reqData.token}`,
                },
            });
            dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data });
            dispatch(findCart(reqData.token)); // Dispatch findCart to update cart id
            // let cartid = dispatch(findCart(reqData.token));
            // if (data.id) {
            //     console.log("Cart ID after adding item:", data.id);
            // } else {
            //     console.error("ADD ITEM TO CART SUCCESS but cartId is undefined: ", data);
            // }

            //console.log("ADD ITEM TO CART SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: error });
            //console.log("ADD ITEM TO CART FAILURE: ", error);
        }
    }
}

export const getAllCartItems = ({reqData}) => {
    console.log("reqdata of get all cart items: ", reqData);
    return async (dispatch) => {
        dispatch({ type: GET_ALL_CART_ITEMS_REQUEST });
        try {
            const response = await api.get(`/api/cart/${reqData.cartId}/items`, {
                headers: {
                    Authorization: `Bearer ${reqData.token}`,
                },
            });
            dispatch({ type: GET_ALL_CART_ITEMS_SUCCESS, payload: response.data });
            //console.log("GET ALL CART ITEMS SUCCESS: ", response.data);
        } catch (error) {
            dispatch({ type: GET_ALL_CART_ITEMS_FAILURE, payload: error });
            //console.log("GET ALL CART ITEMS FAILURE: ", error);
        }
    }
}

export const updateCartItem = (reqData,token) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_CART_ITEM_REQUEST });
        try {
            const { data } = await api.put(`/api/cart-item/update`, reqData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data });
            dispatch(findCart(token)); // Dispatch findCart to update cart id
            //console.log("UPDATE CART ITEM SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error });
            //console.log("UPDATE CART ITEM FAILURE: ", error);
        }
    }
}

export const removeCartItem = ({ cartItemId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: REMOVE_CART_ITEM_REQUEST });
        try {
            const { data } = await api.delete(`/api/cart-item/${cartItemId}/remove`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: cartItemId });
            dispatch(findCart(jwt)); // Dispatch findCart to update cart id
            //console.log("REMOVE CART ITEM SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: error.message });
            //console.log("REMOVE CART ITEM FAILURE: ", error);
        }
    }
}

export const clearCartAction = (token) => {
    return async (dispatch) => {
        dispatch({ type: CLEAR_CART_REQUEST });
        try {
            const { data } = await api.put(`/api/cart/clear`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: CLEAR_CART_SUCCESS, payload: data });
            //console.log("CLEAR CART SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: CLEAR_CART_FAILURE, payload: error.message });
            //console.log("CLEAR CART FAILURE: ", error);
        }
    }
}

export const calculateCartTotal = (cartItems) => {
    // Tính tổng tiền của giỏ hàng từ cartItems
    const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    return total;
};

