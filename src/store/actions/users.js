import { LOGIN_USER, GET_USER, VALIDATION, UPDATE_USER_TRACK_HISTORY } from './actionTypes';
import { url } from '../../config/config';
import moment from 'moment';
import { AsyncStorage } from 'react-native';
import Toast from 'react-native-simple-toast';
import {onStartTrip} from './index';
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

        let loginTime = moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a');
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
                if(res.status === 501){
                    dispatch(validatedLogin(true, false))
                }else{
                    return res.json();
                }
            }
        })
        .then(response => {
            if(response != undefined){
                let loginID = response.data.loginID;
                let UserID  = response.data.UserID
                AsyncStorage.multiSet( [['username', userName], ['cabnumber', cabNumber], ['loginid', `${loginID}`], ['userid' , `${UserID}`]] , err => {
                    if(!err){
                        dispatch(validatedLogin(true, true));
                    }
                });
            }
        });
    }
}

export const getUser = () => {

    let userName = null;
    let cabNumber = null;

    return {
        type : GET_USER,
        userName : userName,
        cabNumber : cabNumber
    }
}

export const logOut = () => {

    return dispatch => {
        let logoutTime = moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a');
        AsyncStorage.getItem('loginid', (err, res) => {
            if(!err){
                let loginID = parseInt(res);
                let body = JSON.stringify({
                    loginID : loginID,
                    logoutTime : logoutTime
                });
                fetch(`${url}/logout`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: body
                });
            }
        });
    }
}

export const userTrackHistory = (userTrackObj) => {
    return dispatch => {
        fetch(`${url}/usertrackhistory`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userTrackObj)
        }).then( res => {
            if(res !== undefined){
                if(res.status === 501){
                    dispatch(updateUserTrackHistoryStatus(false));
                }else if(res.status === 403){
                    dispatch(onStartTrip(true, null, null));
                }else{
                    AsyncStorage.multiSet([['sourceLat',`${userTrackObj.sourceLat}`], 
                    ['sourceLong', `${userTrackObj.sourceLong}`], ['sourceTime', userTrackObj.startTime] ,
                    ['destLat',`${userTrackObj.destLat}`], ['destLong', `${userTrackObj.destLong}`] ,
                    ['destTime',userTrackObj.endTime]],
                        (err, results) => {
                            if(err){
                                Toast.show(`err : ${err}`);
                            }
                        });
                }
            }
        }).catch( error => {
           Toast.show('Error in tracking...');
        });
    }
        
}
