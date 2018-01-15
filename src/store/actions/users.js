import { LOGIN_USER, GET_USER, VALIDATION } from './actionTypes';
import { url } from '../../config/config';
import moment from 'moment';

export const validatedLogin = (isLoggedIn, isValidation) => {
    return {
        type : LOGIN_USER,
        isLoggedIn : isLoggedIn,
        isValidation : isValidation
    }
}

export const loginUser = (userName, password, cabNumber) => {
    let isLoggedIn = false;

    return dispatch => {

        let loginTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
        let body = JSON.stringify({
            cabNumber : cabNumber,
            userName : userName,
            password : password,
            loginTime : loginTime
        });

        fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        })
        .catch(err => {
            dispatch(validatedLogin(true, false))
        })
        .then(res => {
            if(res === undefined){
                dispatch(validatedLogin(true, false))
            }else{
                let response = res.json();
                if(res.status === 501){
                    dispatch(validatedLogin(true, false))
                }else{
                    dispatch(validatedLogin(true, true))
                }
            }
        });
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