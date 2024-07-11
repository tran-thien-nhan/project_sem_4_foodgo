import { api } from "../../Config/api";
import { GET_ALL_PUBLIC_FOODS_FAILURE, GET_ALL_PUBLIC_FOODS_REQUEST, GET_ALL_PUBLIC_FOODS_SUCCESS } from "./ActionType";

export const getAllFoods = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_PUBLIC_FOODS_REQUEST });
        try {
            const { data } = await api.get('api/public/foods');
            dispatch({ type: GET_ALL_PUBLIC_FOODS_SUCCESS, payload: data });
            console.log("ALL FOODS: ", data);
        }
        catch (error) {
            dispatch({ type: GET_ALL_PUBLIC_FOODS_FAILURE, payload: error });
            console.log("ERROR: ", error);
        }
    }
};
