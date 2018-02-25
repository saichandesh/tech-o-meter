import { url } from '../../config/config';
import { EXPENSE_SUBMIT } from './actionTypes';
import {setAlreadyExistsState} from './index';

export const onExpenseSubmitted = (alreadyExists, successExpenseSubmit, expenseSubmit) => {
    return {
        type : EXPENSE_SUBMIT,
        alreadyExists : alreadyExists,
        expenseSubmit: expenseSubmit,
        successExpenseSubmit: successExpenseSubmit
    }
}

export const expenseSubmit = (expense) => {
    return dispatch => {

        let body = JSON.stringify(expense);

        fetch(`${url}/expense`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        })
        .catch(err => dispatch(onExpenseSubmitted(false, false, true)) )
        .then( res => {
            if(res === undefined){
                dispatch(onExpenseSubmitted(false, false, true))
            }else{
                if(res.status === 501){
                    dispatch(onExpenseSubmitted(false, false, true))
                }else if(res.status === 403){
                    dispatch(setAlreadyExistsState(true));
                }else{
                    return res.json();
                }
            }
        }).then(response => {
            if(response != undefined){
                dispatch(onExpenseSubmitted(false, true, true))
            }else{
                dispatch(onExpenseSubmitted(false, false, true))
            }
        });
    }
}