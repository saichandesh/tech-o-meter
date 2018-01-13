import { END_TRIP, NEW_TRIP, DISMISS_MODAL } from './actionTypes';

export const onEndTrip = () => {
    return{
        type : END_TRIP,
        endTripComplete : true
    }
}

export const endTrip = (totalFare, cardAmount, cashAmount, destLat, destLong ) => {
    
    return dispatch => {
        setTimeout(() => {
            dispatch(onEndTrip());
        }, 5000);
    }
}

export const newTrip = () => {
    return{
        type : NEW_TRIP,
        endTripComplete : false
    }
}

export const dismissModal = (dismissModal) => {
    return {
        type : DISMISS_MODAL,
        dismissModal : dismissModal
    }
}