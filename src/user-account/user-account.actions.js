export const AccountActionType = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    USER_WENT_TO_LOGIN_PAGE: 'USER_WENT_TO_LOGIN_PAGE',
    USER_HAS_BEEN_LOGGED_IN: 'USER_HAS_BEEN_LOGGED_IN',
    USER_HAS_NOT_BEEN_LOGGED_IN: 'USER_HAS_NOT_BEEN_LOGGED_IN',

    REGISTER: 'REGISTER',
    USER_WENT_TO_REGISTER_PAGE: 'USER_WENT_TO_REGISTER_PAGE',
    USER_HAS_BEEN_REGISTERED: 'USER_HAS_BEEN_REGISTERED',
    USER_HAS_NOT_BEEN_REGISTERED: 'USER_HAS_NOT_BEEN_REGISTERED',
};

export const login = (email, password) => {
    return {
        type: AccountActionType.LOGIN,
        payload: {
            email,
            password,
        }
    };
};

export const logout = () => {
    return {
        type: AccountActionType.LOGOUT,
    };
};

export const userWentToLoginPage = () => {
    return {
        type: AccountActionType.USER_WENT_TO_LOGIN_PAGE,
    };
};


export const userHasBeenLoggedIn = () => {
    return {
        type: AccountActionType.USER_HAS_BEEN_LOGGED_IN
    };
};

export const userHasNotBeenLoggedIn = (errorMessage) => {
    return {
        type: AccountActionType.USER_HAS_NOT_BEEN_LOGGED_IN,
        payload: errorMessage
    };
};

export const register = (email, password, name, surname) => {
    return {
        type: AccountActionType.REGISTER,
        payload: {
            email,
            password,
            name,
            surname
        }
    };
};

export const userWentToRegisterPage = () => {
    return {
        type: AccountActionType.USER_WENT_TO_REGISTER_PAGE,
    };
};

export const userHasBeenRegistered = () => {
    return {
        type: AccountActionType.USER_HAS_BEEN_REGISTERED
    };
};

export const userHasNotBeenRegistered = (errorMessage) => {
    return {
        type: AccountActionType.USER_HAS_NOT_BEEN_REGISTERED,
        payload: errorMessage
    };
};

