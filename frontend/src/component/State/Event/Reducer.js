import * as actionTypes from './ActionType';

const initialState = {
    events: [],
    event: null,
    favorites: [],  // Thêm dòng này để lưu trữ sự kiện yêu thích
    loading: false,
    error: null,
    count: 0,
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
                    event.id === action.payload.id? action.payload : event
                )
            };
        case actionTypes.ALL_EVENTS_OF_FAVORITED_RESTAURANTS_SUCCESS:
            return {
                ...state,
                loading: false,
                events: action.payload,
            };
        case actionTypes.TOGGLE_AVAILABLE_FAILURE:
        case actionTypes.GET_EVENT_FAVORITED_BY_ID_FAILURE:
        case actionTypes.ADD_EVENT_TO_FAVORITE_FAILURE:
        case actionTypes.CREATE_EVENT_FAILURE:
        case actionTypes.UPDATE_EVENT_FAILURE:
        case actionTypes.DELETE_EVENT_FAILURE:
        case actionTypes.GET_EVENTS_BY_RESTAURANT_FAILURE:
        case actionTypes.GET_EVENT_BY_ID_FAILURE:
        case actionTypes.GET_EVENT_FAVORITED_BY_ID_FAILURE:
        case actionTypes.TOGGLE_AVAILABLE_FAILURE:
        case actionTypes.ALL_EVENTS_OF_FAVORITED_RESTAURANTS_FAILURE:
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
