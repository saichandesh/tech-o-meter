import { url } from '../../config/config';
import { SETTINGS_SUBMIT } from './actionTypes';

export const onSettingsSubmitted = (alreadyExists, successSettingsSubmit, settingsSubmit) => {
    return {
        type : SETTINGS_SUBMIT,
        alreadyExists : alreadyExists,
        settingsSubmit: settingsSubmit,
        successSettingsSubmit: successSettingsSubmit
    }
}

export const settingsSubmit = (settings) => {
    return dispatch => {

        let body = JSON.stringify(settings);

        fetch(`${url}/settings`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        })
        .catch(err => dispatch(onSettingsSubmitted(false, false, true)) )
        .then( res => {
            if(res === undefined){
                dispatch(onSettingsSubmitted(false, false, true))
            }else{
                if(res.status === 501){
                    dispatch(onSettingsSubmitted(false, false, true))
                }else if(res.status === 403){
                    dispatch(onSettingsSubmitted(true, false, true))
                }else{
                    return res.json();
                }
            }
        }).then(response => {
            if(response != undefined){
                dispatch(onSettingsSubmitted(false, true, true))
            }else{
                dispatch(onSettingsSubmitted(false, false, true))
            }
        });
    }
}