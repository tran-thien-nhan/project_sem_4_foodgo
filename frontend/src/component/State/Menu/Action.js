import { api } from "../../Config/api";
import {
    CREATE_MENU_ITEM_REQUEST,
    CREATE_MENU_ITEM_SUCCESS,
    CREATE_MENU_ITEM_FAILURE,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_PUBLIC_REQUEST,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_PUBLIC_SUCCESS,
    GET_MENU_ITEMS_BY_RESTAURANT_ID_PUBLIC_FAILURE,
    DELETE_MENU_ITEM_REQUEST,
    DELETE_MENU_ITEM_SUCCESS,
    DELETE_MENU_ITEM_FAILURE,
    SEARCH_MENU_ITEM_REQUEST,
    SEARCH_MENU_ITEM_SUCCESS,
    SEARCH_MENU_ITEM_FAILURE,
    UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST,
    UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS,
    UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
    GET_INGREDIENTS_OF_MENU_ITEM_REQUEST,
    GET_INGREDIENTS_OF_MENU_ITEM_SUCCESS,
    GET_INGREDIENTS_OF_MENU_ITEM_FAILURE
} from "./ActionType";

export const createMenuItem = ({ menu, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_MENU_ITEM_REQUEST });
        try {
            const { data } = await api.post('api/admin/food', menu, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            dispatch({ type: CREATE_MENU_ITEM_SUCCESS, payload: data });
            console.log("CREATED MENU: ", data);
        }
        catch (error) {
            dispatch({ type: CREATE_MENU_ITEM_FAILURE, payload: error });
            console.log("ERROR: ", error);
        }
    }
}

export const getMenuItemsByRestaurantId = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST });
        try {
            const { data } = await api.get(`api/food/restaurant/${reqData.restaurantId}
                ?vegetarian=${reqData.vegetarian}
                &nonveg=${reqData.nonveg}
                &seasonal=${reqData.seasonal}
                &food_category=${reqData.foodCategory}
                `, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                },
            });
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, payload: data });
            console.log("MENU ITEMS: ", data);
        }
        catch (error) {
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, payload: error });
            console.log("ERROR: ", error);
        }
    }
}

export const getMenuItemsByRestaurantIdPublic = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_PUBLIC_REQUEST });
        try {
            const { data } = await api.get(`api/public/food/restaurant/${reqData.restaurantId}
                ?vegetarian=${reqData.vegetarian}
                &nonveg=${reqData.nonveg}
                &seasonal=${reqData.seasonal}
                &food_category=${reqData.foodCategory}`
            );
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_PUBLIC_SUCCESS, payload: data });
            console.log("MENU ITEMS: ", data);
        }
        catch (error) {
            dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_PUBLIC_FAILURE, payload: error });
            console.log("ERROR: ", error);
        }
    }
}

export const searchMenuItem = ({keyword, jwt}) => {
    return async (dispatch) => {
        dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
        try {
            const { data } = await api.get(`api/food/search?name=${keyword}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
            console.log("SEARCHED MENU: ", data);
        }
        catch (error) {
            dispatch({ type: SEARCH_MENU_ITEM_FAILURE, payload: error });
            console.log("ERROR: ", error);
        }
    }
}

export const getAllIngredientsOfMenuItem = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_INGREDIENTS_OF_MENU_ITEM_REQUEST});
        try {
            const { data } = await api.get(`api/food/${reqData.menuItemId}/ingredients`, {
                headers: {
                    Authorization: `Bearer ${reqData.jwt}`
                },
            });
            dispatch({ type: GET_INGREDIENTS_OF_MENU_ITEM_SUCCESS, payload: data });
            console.log("INGREDIENTS: ", data);
        }
        catch (error) {
            dispatch({ type: GET_INGREDIENTS_OF_MENU_ITEM_FAILURE, payload: error });
            console.log("ERROR: ", error);
        }
    }
}

export const updateMenuItemsAvailability = ({foodId, jwt}) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST });
        try {
            const { data } = await api.put(`api/admin/food/${foodId}`, {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload: data });
            console.log("UPDATED MENU: ", data);
        }
        catch (error) {
            dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE, payload: error });
            console.log("ERROR: ", error);
        }
    }
}

export const deleteFoodAction = ({foodId, jwt}) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_MENU_ITEM_REQUEST });
        try {
            const { data } = await api.delete(`api/admin/food/${foodId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: foodId });
            console.log("DELETED MENU: ", data);
        }
        catch (error) {
            dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: error });
            console.log("ERROR: ", error);
        }
    }
}