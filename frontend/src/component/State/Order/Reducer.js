import {
    REFUND_ORDER_REQUEST,
    REFUND_ORDER_SUCCESS,
    REFUND_ORDER_FAILURE,
    GET_USERS_ORDERS_REQUEST,
    GET_USERS_ORDERS_SUCCESS,
    GET_USERS_ORDERS_FAILURE,
    VERIFY_OTP_REQUEST,
    SEND_OTP_REQUEST,
    SEND_OTP_SUCCESS,
    VERIFY_OTP_SUCCESS,
    SEND_OTP_FAILURE,
    VERIFY_OTP_FAILURE,
    SEND_OTP_VIA_EMAIL_REQUEST,
    VERIFY_OTP_VIA_EMAIL_REQUEST,
    SEND_OTP_VIA_EMAIL_SUCCESS,
    VERIFY_OTP_VIA_EMAIL_SUCCESS,
    SEND_OTP_VIA_EMAIL_FAILURE,
    VERIFY_OTP_VIA_EMAIL_FAILURE,
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
        case SEND_OTP_REQUEST:
        case VERIFY_OTP_REQUEST:
        case SEND_OTP_VIA_EMAIL_REQUEST:
        case VERIFY_OTP_VIA_EMAIL_REQUEST:
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
        case SEND_OTP_SUCCESS:
        case VERIFY_OTP_SUCCESS:
        case SEND_OTP_VIA_EMAIL_SUCCESS:
        case VERIFY_OTP_VIA_EMAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            };
        case VERIFY_OTP_FAILURE:
        case VERIFY_OTP_VIA_EMAIL_FAILURE:
        case REFUND_ORDER_FAILURE:
        case GET_USERS_ORDERS_FAILURE:
        case SEND_OTP_FAILURE:
        case SEND_OTP_VIA_EMAIL_FAILURE:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
}
