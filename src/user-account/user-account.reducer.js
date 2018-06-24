import initialState from '../state/initialState';
import {AccountActionType} from './user-account.actions';

export default (state = initialState.userAccount, action) => {
    switch (action.type) {
        case AccountActionType.USER_HAS_NOT_BEEN_LOGGED_IN:
            return {...state, loginPage: {...state.loginPage, errorMessage: action.payload}};
        case AccountActionType.USER_WENT_TO_LOGIN_PAGE:
            return {...state, loginPage: {...state.loginPage, errorMessage: ""}};

        case AccountActionType.USER_HAS_BEEN_REGISTERED:
            return {...state, registerPage: {...state.registerPage, errorMessage: "", isUserRegistered: true}};
        case AccountActionType.USER_HAS_NOT_BEEN_REGISTERED:
            return {
                ...state,
                registerPage: {...state.registerPage, errorMessage: action.payload, isUserRegistered: false}
            };
        case AccountActionType.USER_WENT_TO_REGISTER_PAGE:
            return {...state, registerPage: {...state.registerPage, errorMessage: "", isUserRegistered: false}};


        default:
            return state;
    }
};
