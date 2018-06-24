import { combineEpics } from 'redux-observable';

import {
    login,
    logout,
    register,
    userWentToLoginPageEpic,
    userWentToRegisterPageEpic
} from "../user-account/user-account.epics";
import {loadUsersEpic, userWentToMessagesPageEpic} from "../users/users.epics";
import {getPreviousMessages, sendMessage, subscribeMessagesChannel} from "../messages/messages.epics";

export const rootEpic = combineEpics(
    login,
    logout,
    register,
    userWentToLoginPageEpic,
    userWentToRegisterPageEpic,
    userWentToMessagesPageEpic,
    loadUsersEpic,
    sendMessage,
    getPreviousMessages,
    subscribeMessagesChannel
);
