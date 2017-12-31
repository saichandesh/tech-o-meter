import { LOGIN_USER, GET_USER} from './actionTypes';

export const validatedLogin = isLoggedIn => {
    return {
        type : LOGIN_USER,
        isLoggedIn : isLoggedIn
    }
}

export const loginUser = (userName, password, cabNumber) => {
    let isLoggedIn = false;

    return dispatch => {
        setTimeout(() => {
            isLoggedIn = true;
            dispatch(validatedLogin(isLoggedIn));
        }, 2000);
    }
}

export const getUser = () => {

    let userName = null;
    let cabNumber = null;

    // async call to server

    return {
        type : GET_USER,
        userName : userName,
        cabNumber : cabNumber
    }
}