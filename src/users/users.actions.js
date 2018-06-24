export const UsersActionType = {
    LOAD_USERS: 'LOAD_USERS',
    USERS_HAVE_BEEN_LOADED: 'USERS_HAVE_BEEN_LOADED',
    USERS_HAVE_NOT_BEEN_LOADED: 'USERS_HAVE_NOT_BEEN_LOADED',
};

export const loadUsers = () => {
    return {
        type: UsersActionType.LOAD_USERS,
    };
};

export const usersHaveBeenLoaded = (users) => {
    return {
        type: UsersActionType.USERS_HAVE_BEEN_LOADED,
        payload: users
    };
};

export const usersHaveNotBeenLoaded = () => {
    return {
        type: UsersActionType.USERS_HAVE_NOT_BEEN_LOADED,
    };
};
