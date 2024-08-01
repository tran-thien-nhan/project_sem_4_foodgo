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
    UPDATE_VISIBILITY_RATING_REQUEST,
    UPDATE_VISIBILITY_RATING_SUCCESS,
    UPDATE_VISIBILITY_RATING_FAILURE,
    GET_RATINGS_PUBLIC_REQUEST,
    GET_RATINGS_PUBLIC_SUCCESS,
    GET_RATINGS_PUBLIC_FAILURE,
} from "./ActionType";
import { api } from "../../Config/api"
import { Bounce, toast } from "react-toastify";

const chatgptOpenError = (error) => {
    const errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
    const query = `nói bằng tiếng việt, sửa lỗi sau: ${errorDetails} NO YAPPING`;
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(query)}`);
};

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
        toast.success('rated successfully!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    } catch (error) {
        dispatch({ type: ADD_RATING_FAILURE, payload: error });
        console.log("ERROR: ", error);
        // chatgptOpenError(error.response.data);
        toast.error(error.response.data.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    }
};

export const getRatings = ({ jwt, restaurantId }) => async (dispatch) => {
    dispatch({ type: GET_RATINGS_REQUEST });
    try {
        const { data } = await api.get(`/api/ratings/${restaurantId}`,{
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: GET_RATINGS_SUCCESS, payload: data });
        console.log(data);
    } catch (error) {
        dispatch({ type: GET_RATINGS_FAILURE, payload: error });
        console.log(error);
    }
};

export const getRatingsVisible = (restaurantId) => async (dispatch) => {
    dispatch({ type: GET_RATINGS_PUBLIC_REQUEST });
    try {
        const { data } = await api.get(`/api/public/ratings/visible/${restaurantId}`);
        dispatch({ type: GET_RATINGS_PUBLIC_SUCCESS, payload: data });
        console.log(data);
    } catch (error) {
        dispatch({ type: GET_RATINGS_PUBLIC_FAILURE, payload: error });
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

export const updateRatingVisibility = ({ jwt, ratingId }) => async (dispatch) => {
    dispatch({ type: UPDATE_VISIBILITY_RATING_REQUEST });
    try {
        const { data } = await api.put(`/api/ratings/${ratingId}/visibility`, null, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: UPDATE_VISIBILITY_RATING_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_VISIBILITY_RATING_FAILURE, payload: error });
    }
}
