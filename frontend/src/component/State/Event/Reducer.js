import * as actionTypes from './ActionType';

const initialState = {
    events: [],
    event: null,
    favorites: [],
    loading: false,
    error: null,
    count: 0,
    publicEvents: [],
    checkIns: [],
    listCheckIns: [],
    isCheckIn: [],
    analytics: {
        totalInvited: 0,
        totalCheckedIn: 0,
        percentageCheckedIn: 0
    }
};

export const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_EVENT_REQUEST:
        case actionTypes.UPDATE_EVENT_REQUEST:
        case actionTypes.DELETE_EVENT_REQUEST:
        case actionTypes.GET_EVENTS_BY_RESTAURANT_REQUEST:
        case actionTypes.GET_EVENT_BY_ID_REQUEST:
        case actionTypes.ADD_EVENT_TO_FAVORITE_REQUEST:
        case actionTypes.GET_EVENT_FAVORITED_BY_ID_REQUEST:
        case actionTypes.TOGGLE_AVAILABLE_REQUEST:
        case actionTypes.ALL_EVENTS_OF_FAVORITED_RESTAURANTS_REQUEST:
        case actionTypes.GET_ALL_PUBLIC_EVENTS_REQUEST:
        case actionTypes.GET_LIST_USERS_BY_EVENT_REQUEST:
        case actionTypes.IS_USER_CHECKIN_EVENT_REQUEST:
        case actionTypes.GET_LIST_CHECKIN_REQUEST:
        case actionTypes.GET_EVENT_ATTENDEES_ANALYTICS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.CREATE_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                events: [...state.events, action.payload],
            };
        case actionTypes.UPDATE_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                events: state.events.map(event =>
                    event.id === action.payload.id ? action.payload : event
                ),
            };
        case actionTypes.DELETE_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                events: state.events.filter(event => event.id !== action.payload),
            };
        case actionTypes.GET_EVENTS_BY_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                events: action.payload,
            };
        case actionTypes.GET_EVENT_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                event: action.payload,
            };
        case actionTypes.ADD_EVENT_TO_FAVORITE_SUCCESS:
            return {
                ...state,
                loading: false,
                favorites: { ...state.event, isFavorite: true },
            };
        case actionTypes.GET_EVENT_FAVORITED_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                favorites: action.payload || [],  // Cập nhật dòng này để lưu trữ sự kiện yêu thích
                count: action.payload.filter(e => e.available === true).length
            };
        case actionTypes.TOGGLE_AVAILABLE_SUCCESS:
            return {
                ...state,
                loading: false,
                events: state.events.map(event =>
                    event.id === action.payload.id ? action.payload : event
                )
            };
        case actionTypes.ALL_EVENTS_OF_FAVORITED_RESTAURANTS_SUCCESS:
            return {
                ...state,
                loading: false,
                events: action.payload,
            };
        case actionTypes.GET_ALL_PUBLIC_EVENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                publicEvents: action.payload
            };
        case actionTypes.GET_LIST_USERS_BY_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                checkIns: action.payload,
            };
        case actionTypes.IS_USER_CHECKIN_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                isCheckIn: action.payload,
                checkIns: state.checkIns.map(user =>
                    user.userId === action.payload.userId ? action.payload : user
                )
            };
        case actionTypes.GET_LIST_CHECKIN_SUCCESS:
            return {
                ...state,
                loading: false,
                listCheckIns: action.payload,
            };
        case actionTypes.GET_EVENT_ATTENDEES_ANALYTICS_SUCCESS:
            return {
                ...state,
                loading: false,
                analytics: action.payload,
            };
        case actionTypes.CREATE_EVENT_FAILURE:
        case actionTypes.GET_ALL_PUBLIC_EVENTS_FAILURE:
        case actionTypes.GET_LIST_USERS_BY_EVENT_FAILURE:
        case actionTypes.CREATE_EVENT_FAILURE:
        case actionTypes.TOGGLE_AVAILABLE_FAILURE:
        case actionTypes.GET_EVENT_FAVORITED_BY_ID_FAILURE:
        case actionTypes.ADD_EVENT_TO_FAVORITE_FAILURE:
        case actionTypes.UPDATE_EVENT_FAILURE:
        case actionTypes.DELETE_EVENT_FAILURE:
        case actionTypes.GET_EVENTS_BY_RESTAURANT_FAILURE:
        case actionTypes.GET_EVENT_BY_ID_FAILURE:
        case actionTypes.ALL_EVENTS_OF_FAVORITED_RESTAURANTS_FAILURE:
        case actionTypes.GET_EVENT_ATTENDEES_ANALYTICS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default eventReducer;
