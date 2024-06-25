import {
    REFUND_ORDER_REQUEST,
    REFUND_ORDER_SUCCESS,
    REFUND_ORDER_FAILURE,
    GET_USERS_ORDERS_REQUEST,
    GET_USERS_ORDERS_SUCCESS,
    GET_USERS_ORDERS_FAILURE,
} from './ActionType';

const initialState = {
    orders: [],
    loading: false,
    error: null
};

export const orderReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case REFUND_ORDER_REQUEST:
        case GET_USERS_ORDERS_REQUEST:
            return {
                ...state,
                error: null,
                loading: true
            };
        case REFUND_ORDER_SUCCESS:
        case GET_USERS_ORDERS_SUCCESS:
            return {
                ...state,
                orders: payload,
                loading: false,
                error: null
            };
        case REFUND_ORDER_FAILURE:
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
