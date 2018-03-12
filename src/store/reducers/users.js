import { LOGIN_USER, 
    GET_USER, VALIDATION, 
    EXPENSE_SUBMIT, 
    TRIP_HISTORY_SUBMIT, 
    SETTINGS_SUBMIT, 
    START_TRIP,
    ALREADY_USER_EXISTS,
    UPDATE_USER_TRACK_HISTORY } from '../actions/actionTypes';

const intialState = {
    userName : null,
    cabNumber: null,
    isLoggedIn: false,
    isValidation : false,
    alreadyExists : false,
    expenseSubmit: false,
    tripHistorySubmit: false,
    successExpenseSubmit : false,
    successTripHistorySubmit : false,
    settingsSubmit : false,
    successSettingsSubmit : false,
    successStatTrip : false, 
    startTripSubmit : false,
    userTrackHistorystatus: null
}


const userReducer = (state = intialState, action) => {
    switch(action.type){
        case LOGIN_USER :
            return {
                ...state,
                isLoggedIn : action.isLoggedIn,
                isValidation :action.isValidation
            }
            break;
        case GET_USER :
            return {
                ...state,
                userName : action.userName,
                cabNumber: action.cabNumber
            }
            break;
        case EXPENSE_SUBMIT:
            return{
                ...state,
                alreadyExists : action.alreadyExists,
                expenseSubmit : action.expenseSubmit,
                successExpenseSubmit : action.successExpenseSubmit
            }
            break;
        case TRIP_HISTORY_SUBMIT:
            return{
                ...state,
                alreadyExists : action.alreadyExists,
                tripHistorySubmit : action.tripHistorySubmit,
                successTripHistorySubmit: action.successTripHistorySubmit
            }
            break;
        case SETTINGS_SUBMIT:
            return{
                ...state,
                alreadyExists : action.alreadyExists,
                settingsSubmit : action.settingsSubmit,
                successSettingsSubmit: action.successSettingsSubmit
            }
            break;
        case START_TRIP:
            return{
                ...state,
                alreadyExists : action.alreadyExists,
                successStatTrip : action.successStatTrip, 
                startTripSubmit : action.startTripSubmit
            }
            break;
        case ALREADY_USER_EXISTS:
            return{
                ...state,
                alreadyExists: action.alreadyExists
            }
            break;
        case UPDATE_USER_TRACK_HISTORY:
            return{
                ...state,
                userTrackHistorystatus: action.status
            }
        default:
            return state;
    }
}

export default userReducer;