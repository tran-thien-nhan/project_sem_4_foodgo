
import { useNavigate } from 'react-router-dom';
import { api } from '../../Config/api';
import { findCart } from '../Cart/Action';
import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    CREATE_ORDER__REQUEST,
    CREATE_ORDER__SUCCESS,
    CREATE_ORDER__FAILURE,
    CONFIRM_ORDER_REQUEST,
    CONFIRM_ORDER_SUCCESS,
    CONFIRM_ORDER_FAILURE,
    GET_USERS_ORDERS_REQUEST,
    GET_USERS_ORDERS_SUCCESS,
    GET_USERS_ORDERS_FAILURE,
    GET_USERS_NOTIFICATION_REQUEST,
    GET_USERS_NOTIFICATION_SUCCESS,
    GET_USERS_NOTIFICATION_FAILURE,
    UPDATE_ORDER_ISPAY_REQUEST,
    UPDATE_ORDER_ISPAY_SUCCESS,
    UPDATE_ORDER_ISPAY_FAILURE,
    REFUND_ORDER_REQUEST,
    REFUND_ORDER_SUCCESS,
    REFUND_ORDER_FAILURE
} from './ActionType';
import { Bounce, toast } from "react-toastify";

export const createOrder = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_ORDER_REQUEST });
        try {
            const { data } = await api.post('/api/order', reqData.order, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                }
            });

            if (data) {
                //window.location.href = data.payment_url;

                //do là mảng chứa các payment_url nên sẽ dùng vòng lặp để mở 2 link này sang tab mới
                // Mở mỗi payment_url trong tab mới
                data.forEach(paymentResponse => {
                    window.open(paymentResponse.payment_url, '_blank');
                });

                toast.success('create order successfully!', {
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

            dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
            console.log("CREATE ORDER SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: CREATE_ORDER_FAILURE, payload: error });
            console.log("CREATE ORDER FAILURE: ", error);
        }
    }
}

export const updateOrderIsPay = (reqData) => {
    return async (dispatch) => {
        let success = false;
        dispatch({ type: UPDATE_ORDER_ISPAY_REQUEST });
        try {
            const { data } = await api.put(`/api/order/toggle-payment-status/${reqData.orderId}`, null, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                }
            });
            if (data) {
                success = true;

                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            }

            dispatch({ type: UPDATE_ORDER_ISPAY_SUCCESS, payload: data });
            console.log("UPDATE ORDER IS PAY SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: UPDATE_ORDER_ISPAY_FAILURE, payload: error });
            console.log("UPDATE ORDER IS PAY FAILURE: ", error.response ? error.response.data : error.message);
        }
    }
}

export const confirmOrder = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: CONFIRM_ORDER_REQUEST });
        try {
            const { data } = await api.post('/api/order/confirm', reqData.order, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                }
            });

            dispatch({ type: CONFIRM_ORDER_SUCCESS, payload: data });
            dispatch(findCart(reqData.jwt));
            console.log("CONFIRM ORDER SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: CONFIRM_ORDER_FAILURE, payload: error });
            console.log("CONFIRM ORDER FAILURE: ", error);
        }
    }
}

export const getUsersOrders = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_USERS_ORDERS_REQUEST });
        try {
            const { data } = await api.get('/api/order/user', {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            dispatch({ type: GET_USERS_ORDERS_SUCCESS, payload: data });
            console.log("GET USERS ORDERS SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: GET_USERS_ORDERS_FAILURE, payload: error });
            console.log("GET USERS ORDERS FAILURE: ", error);
        }
    }
}

export const getUsersNotificationAction = () => {
    return async (dispatch) => {
        dispatch({ type: GET_USERS_NOTIFICATION_REQUEST });
        try {
            const { data } = await api.get('/api/notifications');

            dispatch({ type: GET_USERS_NOTIFICATION_SUCCESS, payload: data });
            console.log("GET USERS NOTIFICATION SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: GET_USERS_NOTIFICATION_FAILURE, payload: error });
            console.log("GET USERS NOTIFICATION FAILURE: ", error);
        }
    }
}

export const refundOrder = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: REFUND_ORDER_REQUEST });
        try {
            const { data } = await api.post(`/api/order/refund/${reqData.orderId}`, null, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                }
            });

            dispatch({ type: REFUND_ORDER_SUCCESS, payload: data });
            dispatch(getUsersOrders(reqData.jwt)); // Cập nhật lại danh sách đơn hàng sau khi hoàn tiền
            toast.success('refund order successfully!', {
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
            console.log("REFUND ORDER SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: REFUND_ORDER_FAILURE, payload: error });
            console.log("REFUND ORDER FAILURE: ", error);
        }
    }
}


