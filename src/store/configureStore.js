import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from './reducers/users';
import tripReducer from './reducers/trip';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    user : userReducer,
    trip : tripReducer
});

const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(thunk));
}

export default configureStore;