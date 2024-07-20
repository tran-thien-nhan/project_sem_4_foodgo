import { api } from "../../Config/api";
import { getUser } from "../Authentication/Action";
import {
    CREATE_EVENT_REQUEST,
    CREATE_EVENT_SUCCESS,
    CREATE_EVENT_FAILURE,
    UPDATE_EVENT_REQUEST,
    UPDATE_EVENT_SUCCESS,
    UPDATE_EVENT_FAILURE,
    DELETE_EVENT_REQUEST,
    DELETE_EVENT_SUCCESS,
    DELETE_EVENT_FAILURE,
    GET_EVENTS_BY_RESTAURANT_REQUEST,
    GET_EVENTS_BY_RESTAURANT_SUCCESS,
    GET_EVENTS_BY_RESTAURANT_FAILURE,
    GET_EVENT_BY_ID_REQUEST,
    GET_EVENT_BY_ID_SUCCESS,
    GET_EVENT_BY_ID_FAILURE,
    ADD_EVENT_TO_FAVORITE_REQUEST,
    ADD_EVENT_TO_FAVORITE_SUCCESS,
    ADD_EVENT_TO_FAVORITE_FAILURE,
    GET_EVENT_FAVORITED_BY_ID_REQUEST,
    GET_EVENT_FAVORITED_BY_ID_SUCCESS,
    GET_EVENT_FAVORITED_BY_ID_FAILURE,
    TOGGLE_AVAILABLE_REQUEST,
    TOGGLE_AVAILABLE_SUCCESS,
    TOGGLE_AVAILABLE_FAILURE,
    ALL_EVENTS_OF_FAVORITED_RESTAURANTS_REQUEST,
    ALL_EVENTS_OF_FAVORITED_RESTAURANTS_SUCCESS,
    ALL_EVENTS_OF_FAVORITED_RESTAURANTS_FAILURE,
    GET_ALL_PUBLIC_EVENTS_REQUEST,
    GET_ALL_PUBLIC_EVENTS_SUCCESS,
    GET_ALL_PUBLIC_EVENTS_FAILURE
} from "./ActionType";
import { Bounce, toast } from "react-toastify";

export const createEvent = ({ restaurantId, eventData, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_EVENT_REQUEST });
        try {
            const { data } = await api.post(`/api/events/restaurant/${restaurantId}`, eventData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: CREATE_EVENT_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: CREATE_EVENT_FAILURE, payload: error });
        }
    };
};

export const updateEvent = ({ eventId, eventData, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_EVENT_REQUEST });
        try {
            console.log("eventdata: ", eventData);
            const { data } = await api.put(`/api/events/${eventId}`, eventData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: UPDATE_EVENT_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: UPDATE_EVENT_FAILURE, payload: error });
        }
    };
};

export const deleteEvent = ({ eventId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_EVENT_REQUEST });
        try {
            await api.delete(`/api/events/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: DELETE_EVENT_SUCCESS, payload: eventId });
        } catch (error) {
            dispatch({ type: DELETE_EVENT_FAILURE, payload: error });
        }
    };
};

export const getEventsByRestaurant = ({ restaurantId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_EVENTS_BY_RESTAURANT_REQUEST });
        try {
            const { data } = await api.get(`/api/events/restaurant/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: GET_EVENTS_BY_RESTAURANT_SUCCESS, payload: data });
            console.log("RESTAURANT EVENTS: ", data);
        } catch (error) {
            dispatch({ type: GET_EVENTS_BY_RESTAURANT_FAILURE, payload: error });
            console.log(error);
        }
    };
};

export const getEventById = ({ eventId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_EVENT_BY_ID_REQUEST });
        try {
            const { data } = await api.get(`/api/events/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: GET_EVENT_BY_ID_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_EVENT_BY_ID_FAILURE, payload: error });
        }
    };
};

export const addEventToFavorite = ({ eventId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: ADD_EVENT_TO_FAVORITE_REQUEST });
        try {
            const { data } = await api.post(`/api/events/${eventId}/favorite`, {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: ADD_EVENT_TO_FAVORITE_SUCCESS, payload: data });
            dispatch(getUser(jwt));
            dispatch(getFavoritesEvents(jwt))
            dispatch(getAllFavoritedRestaurantsEvents(jwt));
            console.log("Added event to favorites: ", data);
        } catch (error) {
            dispatch({ type: ADD_EVENT_TO_FAVORITE_FAILURE, payload: error });
            console.log("Error: ", error);
            toast.error(error.response.data.message, {
                position: "top-center",
                autoClose: 1000,
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
}

export const getFavoritesEvents = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: GET_EVENT_FAVORITED_BY_ID_REQUEST });
        try {
            const { data } = await api.get(`/api/events/favorites`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: GET_EVENT_FAVORITED_BY_ID_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_EVENT_FAVORITED_BY_ID_FAILURE, payload: error });
            console.log("Error: ", error);
        }
    };
}

export const toggleAvailable = ({ eventId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: TOGGLE_AVAILABLE_REQUEST });
        try {
            const { data } = await api.put(`/api/events/${eventId}/toggle-available`, {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: TOGGLE_AVAILABLE_SUCCESS, payload: data });
            dispatch(getUser(jwt));
            dispatch(getEventsByRestaurant({ restaurantId: data.restaurantId, jwt }));
            // dispatch(getAllFavoritedRestaurantsEvents(jwt));
            console.log("Toggled event available: ", data);
        } catch (error) {
            dispatch({ type: TOGGLE_AVAILABLE_FAILURE, payload: error });
            console.log("Error: ", error);
        }
    }
}

export const getAllFavoritedRestaurantsEvents = (jwt) => {
    return async (dispatch) => {
        dispatch({ type: ALL_EVENTS_OF_FAVORITED_RESTAURANTS_REQUEST });
        try {
            const { data } = await api.get(`/api/events/favorites-of-restaurants`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: ALL_EVENTS_OF_FAVORITED_RESTAURANTS_SUCCESS, payload: data });
            console.log("All events of favorited restaurants: ", data);
        } catch (error) {
            dispatch({ type: ALL_EVENTS_OF_FAVORITED_RESTAURANTS_FAILURE, payload: error });
            console.log("Error: ", error);
        }
    };
}

export const getAllPubLicEvents = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_PUBLIC_EVENTS_REQUEST });
        try {
            const { data } = await api.get(`/api/public/events`);
            dispatch({ type: GET_ALL_PUBLIC_EVENTS_SUCCESS, payload: data });
            console.log("All public events: ", data);
        } catch (error) {
            dispatch({ type: GET_ALL_PUBLIC_EVENTS_FAILURE, payload: error });
            console.log("Error: ", error);
        }
    };
}