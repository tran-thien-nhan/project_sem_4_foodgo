import { api } from '../../Config/api';
import {
    GET_INGREDIENTS,
    UPDATE_STOCK,
    CREATE_INGREDIENT_REQUEST,
    CREATE_INGREDIENT_SUCCESS,
    CREATE_INGREDIENT_FAILURE,
    CREATE_INGREDIENT_CATEGORY_REQUEST,
    CREATE_INGREDIENT_CATEGORY_SUCCESS,
    CREATE_INGREDIENT_CATEGORY_FAILURE,
    GET_INGREDIENT_CATEGORIES_REQUEST,
    GET_INGREDIENT_CATEGORIES_SUCCESS,
    GET_INGREDIENT_CATEGORIES_FAILURE
} from './ActionType';

export const getIngredientsOfRestaurant = ({ id, jwt }) => {
    return async (dispatch) => {
        try {
            const response = await api.get(`/api/admin/ingredients/restaurant/${id}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch({ type: GET_INGREDIENTS, payload: response.data });
            console.log("GET INGREDIENTS SUCCESS: ", response.data);
        } catch (error) {
            console.log("GET INGREDIENTS FAILURE", error);
        }
    }
}

export const createIngredient = ({ data, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_INGREDIENT_REQUEST });
        try {
            const response = await api.post(`/api/admin/ingredients`, data, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch({ type: CREATE_INGREDIENT_SUCCESS, payload: response.data });
            console.log("CREATE INGREDIENT SUCCESS", response.data);
        } catch (error) {
            dispatch({ type: CREATE_INGREDIENT_FAILURE, payload: error });
            console.log("CREATE INGREDIENT FAILURE", error);
        }
    }
}

export const createIngredientCategory = ({ data, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_INGREDIENT_CATEGORY_REQUEST });
        try {
            const response = await api.post(`/api/admin/ingredients/category`, data, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch({ type: CREATE_INGREDIENT_CATEGORY_SUCCESS, payload: response.data });
            console.log("CREATE INGREDIENT CATEGORY SUCCESS", response.data);
        } catch (error) {
            dispatch({ type: CREATE_INGREDIENT_CATEGORY_FAILURE, payload: error });
            console.log("CREATE INGREDIENT CATEGORY FAILURE", error);
        }
    }
}

export const getIngredientCategory = ({ id, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_INGREDIENT_CATEGORIES_REQUEST });
        try {
            const response = await api.get(`/api/admin/ingredients/restaurant/${id}/category`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch({ type: GET_INGREDIENT_CATEGORIES_SUCCESS, payload: response.data });
            console.log("GET INGREDIENT CATEGORIES SUCCESS", response.data);
        } catch (error) {
            dispatch({ type: GET_INGREDIENT_CATEGORIES_FAILURE, payload: error });
            console.log("GET INGREDIENT CATEGORIES FAILURE", error);
        }
    }
}

export const updateStockOfIngredient = ({ id, jwt }) => {
    return async (dispatch) => {
        try {
            const { data } = await api.put(`/api/admin/ingredients/${id}/stock`, {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dispatch({ type: UPDATE_STOCK, payload: data });
            console.log("UPDATE STOCK SUCCESS", data);
        } catch (error) {
            console.log("UPDATE STOCK FAILURE", error);
        }
    }
}