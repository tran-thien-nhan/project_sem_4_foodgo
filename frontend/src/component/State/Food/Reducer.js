import * as actionTypes from './ActionType';

const initialState = {
    foods: [],
    loading: false,
    error: null,
    search: [],
    message: null,
};

export const foodReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_PUBLIC_FOODS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.GET_ALL_PUBLIC_FOODS_SUCCESS:
            return {
                ...state,
                loading: false,
                foods: action.payload,
                error: null,
            };
        case actionTypes.GET_ALL_PUBLIC_FOODS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
