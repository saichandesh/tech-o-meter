import { END_TRIP, NEW_TRIP, DISMISS_MODAL } from '../actions/actionTypes';

const intialState = {
    endTripComplete : false,
    dismissModal: true
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
        case DISMISS_MODAL:
            return{
                ...state,
                dismissModal : action.dismissModal
            }
            break;
        default:
            return state;
    }
}

export default tripReducer;