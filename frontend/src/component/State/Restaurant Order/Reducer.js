import {
    GET_RESTAURANTS_ORDER_REQUEST,
    GET_RESTAURANTS_ORDER_SUCCESS,
    GET_RESTAURANTS_ORDER_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE,
    GET_RESTAURANTS_ALL_ORDER_REQUEST,
    GET_RESTAURANTS_ALL_ORDER_SUCCESS,
    GET_RESTAURANTS_ALL_ORDER_FAILURE,
    REFUND_ORDER_REQUEST,
    REFUND_ORDER_SUCCESS,
    REFUND_ORDER_FAILURE
} from './ActionType';

const initialState = {
    loading: false,
    error: null,
    orders: []
};

export const restaurantOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_RESTAURANTS_ORDER_REQUEST:
        case UPDATE_ORDER_STATUS_REQUEST:
        case GET_RESTAURANTS_ALL_ORDER_REQUEST:
        case REFUND_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_RESTAURANTS_ORDER_SUCCESS:
        case GET_RESTAURANTS_ALL_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload
            };
        case UPDATE_ORDER_STATUS_SUCCESS:
            const updatedOrders = state.orders.map((order) => order.id === action.payload.id ? action.payload : order);
            return {
                ...state,
                loading: false,
                orders: updatedOrders
            };
        case REFUND_ORDER_SUCCESS:
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload.orderId ? { ...order, orderStatus: 'CANCELLED' } : order
                )
            };
        case GET_RESTAURANTS_ORDER_FAILURE:
        case GET_RESTAURANTS_ALL_ORDER_FAILURE:
        case UPDATE_ORDER_STATUS_FAILURE:
        case REFUND_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state;
    }
};