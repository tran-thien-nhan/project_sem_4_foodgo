// AddressReducer.js
import { 
    GET_ADDRESSES_REQUEST, GET_ADDRESSES_SUCCESS, GET_ADDRESSES_FAILURE, 
    ADD_ADDRESS_REQUEST, ADD_ADDRESS_SUCCESS, ADD_ADDRESS_FAILURE,
    UPDATE_ADDRESS_REQUEST, UPDATE_ADDRESS_SUCCESS, UPDATE_ADDRESS_FAILURE,
    DELETE_ADDRESS_REQUEST, DELETE_ADDRESS_SUCCESS, DELETE_ADDRESS_FAILURE 
} from "./ActionType";

const initialState = {
    addresses: [],
    isLoading: false,
    error: null,
};

export const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADDRESSES_REQUEST:
        case ADD_ADDRESS_REQUEST:
        case UPDATE_ADDRESS_REQUEST:
        case DELETE_ADDRESS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case GET_ADDRESSES_SUCCESS:
            return {
                ...state,
                addresses: action.payload,
                isLoading: false,
            };
        case ADD_ADDRESS_SUCCESS:
            return {
                ...state,
                addresses: [...state.addresses, action.payload],
                isLoading: false,
            };
        case UPDATE_ADDRESS_SUCCESS:
            return {
                ...state,
                addresses: state.addresses.map(address => 
                    address.id === action.payload.id ? action.payload : address
                ),
                isLoading: false,
            };
        case DELETE_ADDRESS_SUCCESS:
            return {
                ...state,
                addresses: state.addresses.filter(address => address.id !== action.payload),
                isLoading: false,
            };
        case GET_ADDRESSES_FAILURE:
        case ADD_ADDRESS_FAILURE:
        case UPDATE_ADDRESS_FAILURE:
        case DELETE_ADDRESS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
