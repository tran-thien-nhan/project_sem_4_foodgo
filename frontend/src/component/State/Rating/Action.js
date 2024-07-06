// src/State/Rating/Action.js

import axios from "axios";
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
} from "./ActionType";
import { api } from "../../Config/api"

export const addRating = ({ jwt, restaurantId, userId, stars, comment }) => async (dispatch) => {
    dispatch({ type: ADD_RATING_REQUEST });
    try {
        const { data } = await api.post('/api/ratings', null, {
            params: { restaurantId, userId, stars, comment },
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: ADD_RATING_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: ADD_RATING_FAILURE, payload: error });
        console.log("ERROR: ",error);
    }
};

export const getRatings = ({ jwt, restaurantId }) => async (dispatch) => {
    dispatch({ type: GET_RATINGS_REQUEST });
    try {
        const { data } = await api.get(`/api/public/ratings/${restaurantId}`);
        dispatch({ type: GET_RATINGS_SUCCESS, payload: data });
        console.log(data);
    } catch (error) {
        dispatch({ type: GET_RATINGS_FAILURE, payload: error });
        console.log(error);
    }
};

export const updateRating = ({ jwt, ratingId, stars, comment }) => async (dispatch) => {
    dispatch({ type: UPDATE_RATING_REQUEST });
    try {
        const { data } = await api.put(`/api/ratings/${ratingId}`, null, {
            params: { stars, comment },
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: UPDATE_RATING_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_RATING_FAILURE, payload: error });
    }
};

export const deleteRating = ({ jwt, ratingId }) => async (dispatch) => {
    dispatch({ type: DELETE_RATING_REQUEST });
    try {
        await api.delete(`/api/ratings/${ratingId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: DELETE_RATING_SUCCESS, payload: ratingId });
    } catch (error) {
        dispatch({ type: DELETE_RATING_FAILURE, payload: error });
    }
};
