import { api } from '../../../Config/api';
import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    GET_USERS_ORDERS_REQUEST,
    GET_USERS_ORDERS_SUCCESS,
    GET_USERS_ORDERS_FAILURE,
    GET_USERS_NOTIFICATION_REQUEST,
    GET_USERS_NOTIFICATION_SUCCESS,
    GET_USERS_NOTIFICATION_FAILURE,
} from './ActionType';

export const createOrder = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_ORDER_REQUEST });
        try {
            const {data} = await api.post('/api/order', reqData.order,{
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                }
            });

            // if(data.payment_url){ 
            //     window.location.href = data.payment_url;
            // }

            dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
            console.log("CREATE ORDER SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: CREATE_ORDER_FAILURE, payload: error });
            console.log("CREATE ORDER FAILURE: ", error);
        }
    }
}

export const getUsersOrders = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_USERS_ORDERS_REQUEST });
        try {
            const {data} = await api.get('/api/order', {
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
            const {data} = await api.get('/api/notifications');

            dispatch({ type: GET_USERS_NOTIFICATION_SUCCESS, payload: data });
            console.log("GET USERS NOTIFICATION SUCCESS: ", data);
        } catch (error) {
            dispatch({ type: GET_USERS_NOTIFICATION_FAILURE, payload: error });
            console.log("GET USERS NOTIFICATION FAILURE: ", error);
        }
    }
}


