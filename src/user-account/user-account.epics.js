import { from, of } from 'rxjs';
import { mergeMap, map, mapTo, catchError, pluck, filter, tap} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import config from "../config";
import {
    AccountActionType,
    userHasNotBeenLoggedIn,
    userHasBeenRegistered,
    userHasNotBeenRegistered, userWentToLoginPage, userWentToRegisterPage
} from './user-account.actions';
import {generateKeys} from "../security/generateKeys";
import {LOCATION_CHANGE, push} from "react-router-redux";
import {clearAllTheMessages} from "../messages/messages.actions";

export const login = action$ =>
    action$.ofType(AccountActionType.LOGIN)
        .pipe(
            map((action) => {
                const keys = generateKeys();
                sessionStorage.setItem("clientPrivateKey", keys.privateKey);
                return {
                    ...action,
                    payload: {
                        ...action.payload,
                        clientPublicKey: keys.publicKey,
                    }
                };
            }),
            mergeMap((action) =>
                from(
                    ajax({
                        url: `${config.API_ORIGIN}/api/v1/login`,
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        crossDomain: true,
                        withCredentials: false,
                        body: {
                            email: action.payload.email,
                            password: action.payload.password,
                            client_public_key: action.payload.clientPublicKey, // eslint-disable-line camelcase
                        }
                    })
                ).pipe(
                    pluck('response'),
                    map((data) => {
                        sessionStorage.setItem("serverPublicKey", data.server_public_key);
                        sessionStorage.setItem("sessionId", data.session_id);
                        return push("/");
                    }),
                    catchError((error) => {
                        sessionStorage.clear();
                        return of(userHasNotBeenLoggedIn(error.xhr.response.message));
                    })
                )
            ),
        );


export const logout = action$ =>
    action$.ofType(AccountActionType.LOGOUT)
        .pipe(
            mergeMap(() =>
                from(
                    ajax({
                        url: `${config.API_ORIGIN}/api/v1/user/logout`,
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': sessionStorage.getItem("sessionId")
                        },
                        crossDomain: true,
                        withCredentials: false,
                    })
                ).pipe(
                    mergeMap(() => {
                        sessionStorage.clear();
                        return [push("/login"), clearAllTheMessages()];
                    }),
                    catchError(() => {
                        return of(userHasNotBeenLoggedIn(""));
                    })
                )
            ),
        );

export const userWentToLoginPageEpic = action$ => {
    return action$.ofType(LOCATION_CHANGE)
        .pipe(
            filter((action) => action.payload.pathname === "/login"),
            tap(() => sessionStorage.clear()),
            mapTo(userWentToLoginPage())
        );
};

export const userWentToRegisterPageEpic = action$ => {
    return action$.ofType(LOCATION_CHANGE)
        .pipe(
            filter((action) => action.payload.pathname === "/register"),
            tap(() => sessionStorage.clear()),
            mapTo(userWentToRegisterPage())
        );
};

export const register = action$ =>
    action$.ofType(AccountActionType.REGISTER)
        .pipe(
            mergeMap((action) =>
                from(
                    ajax({
                        url: `${config.API_ORIGIN}/api/v1/register`,
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        crossDomain: true,
                        withCredentials: false,
                        body: {
                            email: action.payload.email,
                            firstname: action.payload.name,
                            lastname: action.payload.surname,
                            password: action.payload.password
                        }
                    })
                ).pipe(
                    mapTo(userHasBeenRegistered()),
                    catchError((error) => {
                        return of(userHasNotBeenRegistered(error.xhr.response.message));
                    })
                )
            ),
        );
