import { isPresentInFavorite } from "../../Config/logic";
import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE, LOGIN_SUPER_ADMIN_REQUEST, LOGIN_SUPER_ADMIN_SUCCESS, LOGIN_SUPER_ADMIN_FAILURE } from "./ActionType";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    jwt: null,
    favorites: [],
    success: null
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case ADD_TO_FAVORITE_REQUEST:
        case RESET_PASSWORD_REQUEST:
        case CHANGE_PASSWORD_REQUEST:
        case LOGIN_SUPER_ADMIN_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
                success: null
            };
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                success: action.payload
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return {
                ...state,
                jwt: action.payload,
                isLoading: false,
                success: "login success"
            };
        case LOGIN_SUPER_ADMIN_SUCCESS:
            return {
                ...state,
                jwt: action.payload,
                isLoading: false,
                success: "Login success"
            };
        case GET_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                favorites: action.payload.favorites
            };
        case ADD_TO_FAVORITE_SUCCESS:
            return {
                ...state,
                favorites: isPresentInFavorite(state.favorites, action.payload)
                    ? state.favorites.filter((item) => item.id !== action.payload.id)
                    : [...state.favorites, action.payload],
                isLoading: false,
                error: null,
                success: "Add to favorite success"
            };
        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                success: "Change password success"
            };
        case LOGIN_SUPER_ADMIN_FAILURE:
        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
        case ADD_TO_FAVORITE_FAILURE:
        case RESET_PASSWORD_FAILURE:
        case CHANGE_PASSWORD_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                success: null
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}