import {
    REGISTER_DRIVER_REQUEST,
    REGISTER_DRIVER_SUCCESS,
    REGISTER_DRIVER_FAILURE,
    GET_AVAILABLE_DRIVERS_REQUEST,
    GET_AVAILABLE_DRIVERS_SUCCESS,
    GET_AVAILABLE_DRIVERS_FAILURE,
    FIND_NEAREST_DRIVER_REQUEST,
    FIND_NEAREST_DRIVER_SUCCESS,
    FIND_NEAREST_DRIVER_FAILURE,
    GET_DRIVER_PROFILE_REQUEST,
    GET_DRIVER_PROFILE_SUCCESS,
    GET_DRIVER_PROFILE_FAILURE,
    GET_DRIVER_CURRENT_RIDE_REQUEST,
    GET_DRIVER_CURRENT_RIDE_SUCCESS,
    GET_DRIVER_CURRENT_RIDE_FAILURE,
    GET_ALLOCATED_RIDES_REQUEST,
    GET_ALLOCATED_RIDES_SUCCESS,
    GET_ALLOCATED_RIDES_FAILURE,
    FIND_DRIVER_BY_ID_REQUEST,
    FIND_DRIVER_BY_ID_SUCCESS,
    FIND_DRIVER_BY_ID_FAILURE,
    COMPLETED_RIDES_REQUEST,
    COMPLETED_RIDES_SUCCESS,
    COMPLETED_RIDES_FAILURE,
    UPDATE_DRIVER_REQUEST,
    UPDATE_DRIVER_SUCCESS,
    UPDATE_DRIVER_FAILURE,
    DELETE_DRIVER_IMAGE_REQUEST,
    DELETE_DRIVER_IMAGE_SUCCESS,
    DELETE_DRIVER_IMAGE_FAILURE,
    CANCELLED_RIDES_REQUEST,
    CANCELLED_RIDES_SUCCESS,
    CANCELLED_RIDES_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    driver: null,
    drivers: [],
    rides: [],
    error: null,
    allocated: [],
    currentRide: null,
    completeRides: null,
    currentRideCount: null,
    cancelledRides: null,
    listCompletedRides: [],
    listCancelledRides: [],
};

const driverReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_DRIVER_REQUEST:
        case GET_AVAILABLE_DRIVERS_REQUEST:
        case FIND_NEAREST_DRIVER_REQUEST:
        case GET_DRIVER_PROFILE_REQUEST:
        case GET_DRIVER_CURRENT_RIDE_REQUEST:
        case GET_ALLOCATED_RIDES_REQUEST:
        case FIND_DRIVER_BY_ID_REQUEST:
        case COMPLETED_RIDES_REQUEST:
        case UPDATE_DRIVER_REQUEST:
        case DELETE_DRIVER_IMAGE_REQUEST:
        case CANCELLED_RIDES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case REGISTER_DRIVER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case GET_ALLOCATED_RIDES_SUCCESS:
            return {
                ...state,
                loading: false,
                allocated: action.payload,
                error: null,
            };
        case GET_DRIVER_CURRENT_RIDE_SUCCESS:
            return {
                ...state,
                loading: false,
                currentRide: action.payload,
                currentRideCount: action.payload.length,
                error: null,
            };
        case COMPLETED_RIDES_SUCCESS:
            return {
                ...state,
                loading: false,
                completeRides: action.payload.length,
                listCompletedRides: action.payload,
                error: null,
            };
        case CANCELLED_RIDES_SUCCESS:
            return {
                ...state,
                loading: false,
                cancelledRides: action.payload.length,
                listCancelledRides: action.payload,
                error: null,
            };
        case GET_AVAILABLE_DRIVERS_SUCCESS:
        case FIND_NEAREST_DRIVER_SUCCESS:
        case GET_DRIVER_PROFILE_SUCCESS:
        case FIND_DRIVER_BY_ID_SUCCESS:
        case UPDATE_DRIVER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case DELETE_DRIVER_IMAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
            };
        case REGISTER_DRIVER_FAILURE:
        case GET_AVAILABLE_DRIVERS_FAILURE:
        case FIND_NEAREST_DRIVER_FAILURE:
        case GET_DRIVER_PROFILE_FAILURE:
        case GET_DRIVER_CURRENT_RIDE_FAILURE:
        case GET_ALLOCATED_RIDES_FAILURE:
        case FIND_DRIVER_BY_ID_FAILURE:
        case COMPLETED_RIDES_FAILURE:
        case UPDATE_DRIVER_FAILURE:
        case DELETE_DRIVER_IMAGE_FAILURE:
        case CANCELLED_RIDES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default driverReducer;
