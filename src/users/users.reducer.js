import initialState from '../state/initialState';
import {UsersActionType} from "./users.actions";

export default (state = initialState.users, action) => {
    switch (action.type) {
        case UsersActionType.USERS_HAVE_BEEN_LOADED:
            return action.payload;
        default:
            return state;
    }
};
