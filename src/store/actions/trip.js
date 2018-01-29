import { END_TRIP, NEW_TRIP, DISMISS_MODAL, TRIP_HISTORY_SUBMIT, START_TRIP } from './actionTypes';
import { url } from '../../config/config';
import { AsyncStorage } from 'react-native';

export const onEndTrip = () => {
    return{
        type : END_TRIP,
        endTripComplete : true
    }
}

export const endTrip = (tripDetails) => {
    
    return dispatch => {
        
        let body = JSON.stringify(tripDetails);

        fetch(`${url}/endtrip`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        })
        .catch(err => dispatch(onStartTrip(false, false, true)) )
        .then( res => {
            if(res === undefined){
                dispatch(onStartTrip(false, false, true));
            }else{
                if(res.status === 501){
                    dispatch(onStartTrip(false, false, true));
                }else if(res.status === 403){
                    dispatch(onStartTrip(true, false, true));
                }else{
                    return res.json();
                }
            }
        }).then(response => {
            if(response != undefined){
                dispatch(onEndTrip());
                dispatch(onStartTrip(false, true, true));
            }else{
                dispatch(onStartTrip(false, false, true))
            }
        });
    }
}

export const newTrip = () => {
    return{
        type : NEW_TRIP,
        endTripComplete : false
    }
}

export const onStartTrip = (alreadyExists, successStatTrip, startTripSubmit) => {
    return{
        type : START_TRIP,
        alreadyExists: alreadyExists,
        successStatTrip: successStatTrip,
        startTripSubmit: startTripSubmit
    }
}

export const startTrip = (trip) => {
    return dispatch => {
        
        let body = JSON.stringify(trip);

        fetch(`${url}/starttrip`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        })
        .catch(err => dispatch(onStartTrip(false, false, true)) )
        .then( res => {
            if(res === undefined){
                dispatch(onStartTrip(false, false, true));
            }else{
                if(res.status === 501){
                    dispatch(onStartTrip(false, false, true));
                }else if(res.status === 403){
                    dispatch(onStartTrip(true, false, true));
                }else{
                    return res.json();
                }
            }
        }).then(response => {
            if(response != undefined){
                let data = response.data;
                AsyncStorage.multiSet( [['tripStarted', 'true'], ['tripLocation', `${data.address}`], ['tripid', `${data.tripID}`], ['tripStartTime', `${trip.startTime}`]] , err => {
                    if(!err){
                        dispatch(onStartTrip(false, true, true));
                    }
                });
            }else{
                dispatch(onStartTrip(false, false, true))
            }
        });
    }
}
export const dismissModal = (dismissModal) => {
    return {
        type : DISMISS_MODAL,
        dismissModal : dismissModal
    }
}

export const onTripHistorySubmitted = (alreadyExists, successTripHistorySubmit, tripHistorySubmit) => {
    return {
        type : TRIP_HISTORY_SUBMIT,
        alreadyExists : alreadyExists,
        tripHistorySubmit: tripHistorySubmit,
        successTripHistorySubmit: successTripHistorySubmit
    }
}

export const tripHistorySubmit = (tripHistory) => {
    return dispatch => {

        let body = JSON.stringify(tripHistory);

        fetch(`${url}/triphistory`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        })
        .catch(err => dispatch(onTripHistorySubmitted(false, false, true)) )
        .then( res => {
            if(res === undefined){
                dispatch(onTripHistorySubmitted(false, false, true))
            }else{
                if(res.status === 501){
                    dispatch(onTripHistorySubmitted(false, false, true))
                }else if(res.status === 403){
                    dispatch(onTripHistorySubmitted(true, false, true))
                }else{
                    return res.json();
                }
            }
        }).then(response => {
            if(response != undefined){
                dispatch(onTripHistorySubmitted(false, true, true))
            }else{
                dispatch(onTripHistorySubmitted(false, false, true))
            }
        });
    }
}