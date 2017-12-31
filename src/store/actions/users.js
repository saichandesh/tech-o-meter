import { LOGIN_USER, GET_USER} from './actionTypes';

export const loginUser = (userName, password, cabNumber) => {
    let isLoggedIn = false;

    return {
        type : LOGIN_USER,
        isLoggedIn : isLoggedIn
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