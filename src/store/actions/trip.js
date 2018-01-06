import { END_TRIP, NEW_TRIP } from './actionTypes';

const dismissModal = () => {
    return{
        type : END_TRIP,
        endTripComplete : true
    }
}

export const endTrip = (totalFare, cardAmount, cashAmount, destLat, destLong ) => {
    
    return dispatch => {
        setTimeout(() => {
            dispatch(dismissModal());
        }, 5000);
    }
}

export const newTrip = () => {
    return{
        type : NEW_TRIP,
        endTripComplete : false
    }
}