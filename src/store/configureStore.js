import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/users';

const rootReducer = combineReducers({
    user : userReducer
});

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;