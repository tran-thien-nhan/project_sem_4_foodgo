// RideReducer.js
import {
    REQUEST_RIDE, REQUEST_RIDE_SUCCESS, REQUEST_RIDE_FAILURE,
    FIND_RIDE_BY_ID_REQUEST, FIND_RIDE_BY_ID_SUCCESS, FIND_RIDE_BY_ID_FAILURE,
    ACCEPT_RIDE_REQUEST, ACCEPT_RIDE_SUCCESS, ACCEPT_RIDE_FAILURE,
    DECLINE_RIDE_REQUEST, DECLINE_RIDE_SUCCESS, DECLINE_RIDE_FAILURE,
    START_RIDE_REQUEST, START_RIDE_SUCCESS, START_RIDE_FAILURE,
    COMPLETE_RIDE_REQUEST, COMPLETE_RIDE_SUCCESS, COMPLETE_RIDE_FAILURE,
    CANCEL_RIDE_REQUEST, CANCEL_RIDE_SUCCESS, CANCEL_RIDE_FAILURE,
    FIND_ALL_RIDE_SUCCESS,
    FIND_ALL_RIDE_REQUEST
} from "./ActionType";

const initialState = {
    ride: null,
    rides: [],
    isLoading: false,
    error: null,
};

export const rideReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_RIDE:
        case FIND_RIDE_BY_ID_REQUEST:
        case ACCEPT_RIDE_REQUEST:
        case DECLINE_RIDE_REQUEST:
        case START_RIDE_REQUEST:
        case COMPLETE_RIDE_REQUEST:
        case CANCEL_RIDE_REQUEST:
        case FIND_ALL_RIDE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case FIND_ALL_RIDE_SUCCESS:
            return {
                ...state,
                rides: action.payload,
                isLoading: false,
            };
        case REQUEST_RIDE_SUCCESS:
            return {
                ...state,
                rides: [...state.rides, action.payload],
                isLoading: false,
            };
        case FIND_RIDE_BY_ID_SUCCESS:
            return {
                ...state,
                ride: action.payload,
                isLoading: false,
            };
        case ACCEPT_RIDE_SUCCESS:
        case DECLINE_RIDE_SUCCESS:
        case START_RIDE_SUCCESS:
        case COMPLETE_RIDE_SUCCESS:
        case CANCEL_RIDE_SUCCESS:
            return {
                ...state,
                rides: state.rides.map(ride =>
                    ride.id === action.payload ? { ...ride, status: action.type } : ride
                ),
                isLoading: false,
            };
        case REQUEST_RIDE_FAILURE:
        case FIND_RIDE_BY_ID_FAILURE:
        case ACCEPT_RIDE_FAILURE:
        case DECLINE_RIDE_FAILURE:
        case START_RIDE_FAILURE:
        case COMPLETE_RIDE_FAILURE:
        case CANCEL_RIDE_FAILURE:
        case REQUEST_RIDE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
