import { LOGIN_USER, GET_USER, VALIDATION } from '../actions/actionTypes';

const intialState = {
    userName : null,
    cabNumber: null,
    isLoggedIn: false,
    isValidation : false
}


const userReducer = (state = intialState, action) => {
    switch(action.type){
        case LOGIN_USER :
            return {
                ...state,
                isLoggedIn : action.isLoggedIn,
                isValidation :action.isValidation
            }
            break;
        case GET_USER :
            return {
                ...state,
                userName : action.userName,
                cabNumber: action.cabNumber
            }
            break;
        default:
            return state;
    }
}

export default userReducer;