import { api } from '../../Config/api';
import {
    GET_RESTAURANTS_ORDER_REQUEST,
    GET_RESTAURANTS_ORDER_SUCCESS,
    GET_RESTAURANTS_ORDER_FAILURE,
    GET_RESTAURANTS_ALL_ORDER_REQUEST,
    GET_RESTAURANTS_ALL_ORDER_SUCCESS,
    GET_RESTAURANTS_ALL_ORDER_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE
} from './ActionType';

// export const updateOrderStatus = ({ orderId, orderStatus, jwt }) => {
//     return async (dispatch) => {
//         dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });
//         try {
//             const response = await api.put(`/api/admin/orders/${orderId}/${orderStatus}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${jwt}`
//                 }
//             });
//             dispatch({ type: UPDATE_ORDER_STATUS_SUCCESS, payload: response.data });
//             console.log("UPDATE ORDER STATUS SUCCESS", response.data);
//         } catch (error) {
//             dispatch({ type: UPDATE_ORDER_STATUS_FAILURE, payload: error });
//             console.log("UPDATE ORDER STATUS FAILURE", error);
//         }
//     }
// }

export const updateOrderStatus = ({ orderId, jwt, newStatus }) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });
        try {
            const response = await api.put(`/api/admin/order/update-status/${orderId}`, { newStatus }, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch({ type: UPDATE_ORDER_STATUS_SUCCESS, payload: response.data });
            console.log("UPDATE ORDER STATUS SUCCESS", response.data);
        } catch (error) {
            dispatch({ type: UPDATE_ORDER_STATUS_FAILURE, payload: error });
            console.log("UPDATE ORDER STATUS FAILURE", error);
        }
    };
};

export const fetchRestaurantsOrder = ({ restaurantId, orderStatus, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_RESTAURANTS_ORDER_REQUEST });
        try {
            const { data } = await api.get(`/api/admin/order/restaurant/${restaurantId}`, {
                params: {
                    order_status: orderStatus
                },
                headers: {
                    Authorization: `Bearer ${jwt}`
                }

            });
            dispatch({ type: GET_RESTAURANTS_ORDER_SUCCESS, payload: data });
            console.log("GET RESTAURANTS ORDER SUCCESS", data);
        } catch (error) {
            dispatch({ type: GET_RESTAURANTS_ORDER_FAILURE, payload: error });
            console.log("GET RESTAURANTS ORDER FAILURE", error);
        }
    }
}

export const fetchRestaurantsAllOrder = ({ restaurantId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_RESTAURANTS_ALL_ORDER_REQUEST });
        try {
            const { data } = await api.get(`/api/admin/all/order/restaurant/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }

            });
            dispatch({ type: GET_RESTAURANTS_ALL_ORDER_SUCCESS, payload: data });
            console.log("GET RESTAURANTS ALL ORDER SUCCESS", data);
        } catch (error) {
            dispatch({ type: GET_RESTAURANTS_ALL_ORDER_FAILURE, payload: error });
            console.log("GET RESTAURANTS ALL ORDER FAILURE", error);
        }
    }
}