import { combineReducers, legacy_createStore, applyMiddleware } from 'redux';
import { authReducer } from './Authentication/Reducer';
import { thunk } from 'redux-thunk'; // Thay đổi import từ 'redux-thunk'
import restaurantReducer from './Restaurant/Reducer';
import menuItemReducer from './Menu/Reducer';
import cartReducer from './Cart/Reducer';
import { orderReducer } from './Order/Reducer';
import { ingredientReducer } from './Ingredients/Reducer';
import { restaurantOrderReducer } from './Restaurant Order/Reducer';
import { ratingReducer } from './Rating/Reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    restaurant: restaurantReducer,
    menu: menuItemReducer,
    cart: cartReducer,
    order: orderReducer,
    restaurantOrder: restaurantOrderReducer,
    ingredients: ingredientReducer,
    rating: ratingReducer
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk)); // tạo ra một store với rootReducer và middleware là thunk

