import {
    GET_USERS_ORDERS_REQUEST,
    GET_USERS_ORDERS_SUCCESS,
    GET_USERS_ORDERS_FAILURE,
    GET_USERS_NOTIFICATION_SUCCESS,
} from './ActionType';

const initialState = {
    orders: [],
    loading: false,
    error: null
};

export const orderReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_USERS_ORDERS_REQUEST:
            return {
                ...state,
                error: null,
                loading: true
            };
        case GET_USERS_ORDERS_SUCCESS:
            return {
                ...state,
                orders: payload,
                loading: false,
                error: null
            };
        case GET_USERS_ORDERS_FAILURE:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
}