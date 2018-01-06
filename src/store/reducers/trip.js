import { END_TRIP, NEW_TRIP } from '../actions/actionTypes';

const intialState = {
    endTripComplete : false
}


const tripReducer = (state = intialState, action) => {
    switch(action.type){
        case END_TRIP :
            return {
                ...state,
                endTripComplete : action.endTripComplete
            }
            break;
        case NEW_TRIP :
            return {
                ...state,
                endTripComplete : action.endTripComplete
            }
            break;
        default:
            return state;
    }
}

export default tripReducer;