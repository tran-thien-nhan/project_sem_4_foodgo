// src/State/Rating/Reducer.js

import {
    ADD_RATING_REQUEST,
    ADD_RATING_SUCCESS,
    ADD_RATING_FAILURE,
    GET_RATINGS_REQUEST,
    GET_RATINGS_SUCCESS,
    GET_RATINGS_FAILURE,
    UPDATE_RATING_REQUEST,
    UPDATE_RATING_SUCCESS,
    UPDATE_RATING_FAILURE,
    DELETE_RATING_REQUEST,
    DELETE_RATING_SUCCESS,
    DELETE_RATING_FAILURE,
    UPDATE_VISIBILITY_RATING_REQUEST,
    UPDATE_VISIBILITY_RATING_SUCCESS,
    UPDATE_VISIBILITY_RATING_FAILURE,
    GET_RATINGS_PUBLIC_SUCCESS,
    GET_RATINGS_PUBLIC_REQUEST,
    GET_RATINGS_PUBLIC_FAILURE,
} from "./ActionType";

const initialState = {
    ratings: [],
    isLoading: false,
    error: null,
};

export const ratingReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_RATING_REQUEST:
        case GET_RATINGS_REQUEST:
        case UPDATE_RATING_REQUEST:
        case DELETE_RATING_REQUEST:
        case UPDATE_VISIBILITY_RATING_REQUEST:
        case GET_RATINGS_PUBLIC_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ADD_RATING_SUCCESS:
            return {
                ...state,
                ratings: [...state.ratings, action.payload],
                isLoading: false,
            };
        case GET_RATINGS_SUCCESS:
        case GET_RATINGS_PUBLIC_SUCCESS:
            return {
                ...state,
                ratings: action.payload,
                isLoading: false,
            };
        case UPDATE_RATING_SUCCESS:
            return {
                ...state,
                ratings: state.ratings.map((rating) =>
                    rating.id === action.payload.id ? action.payload : rating
                ),
                isLoading: false,
            };
        case UPDATE_VISIBILITY_RATING_SUCCESS:
            return {
               ...state,
                ratings: state.ratings.map((rating) =>
                    rating.id === action.payload.id? action.payload : rating
                ),
                isLoading: false,
            };
        case DELETE_RATING_SUCCESS:
            return {
                ...state,
                ratings: state.ratings.filter((rating) => rating.id !== action.payload),
                isLoading: false,
            };
        case ADD_RATING_FAILURE:
        case GET_RATINGS_FAILURE:
        case UPDATE_RATING_FAILURE:
        case DELETE_RATING_FAILURE:
        case UPDATE_VISIBILITY_RATING_FAILURE:
        case GET_RATINGS_PUBLIC_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
