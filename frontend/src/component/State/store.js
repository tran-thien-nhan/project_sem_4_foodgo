import { combineReducers, legacy_createStore, applyMiddleware } from 'redux';
import { authReducer } from './Authentication/Reducer';
import { thunk } from 'redux-thunk'; // Thay đổi import từ 'redux-thunk'

const rootReducer = combineReducers({
    auth: authReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk)); // tạo ra một store với rootReducer và middleware là thunk
