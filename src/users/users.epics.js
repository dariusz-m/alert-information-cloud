import {from, of} from "rxjs";
import {ajax} from "rxjs/ajax";
import {filter, map, catchError, mergeMap, pluck} from "rxjs/operators";
import {LOCATION_CHANGE} from "react-router-redux";

import {loadUsers, UsersActionType, usersHaveBeenLoaded, usersHaveNotBeenLoaded} from "./users.actions";
import config from "../config";
import {isUserAuthenticated} from "../user-account/auth";
import {getPreviousMessages} from "../messages/messages.actions";


export const userWentToMessagesPageEpic = action$ => {
    return action$.ofType(LOCATION_CHANGE)
        .pipe(
            filter((action) => action.payload.pathname === "/" && isUserAuthenticated()),
            mergeMap(() => [getPreviousMessages(), loadUsers()])
        );
};

export const loadUsersEpic = action$ =>
    action$.ofType(UsersActionType.LOAD_USERS)
        .pipe(
            mergeMap(() =>
                from(
                    ajax({
                        url: `${config.API_ORIGIN}/api/v1/user`,
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': sessionStorage.getItem("sessionId")
                        },
                        crossDomain: true,
                        withCredentials: false,
                        body: {}
                    })
                ).pipe(
                    pluck('response', 'user_list'),
                    map((users) => {
                        return usersHaveBeenLoaded(users);
                    }),
                    catchError((error) => {
                        return of(usersHaveNotBeenLoaded(error.xhr.response.message));
                    })
                )
            ),
        );
