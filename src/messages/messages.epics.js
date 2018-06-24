import {catchError, mapTo, mergeMap, retryWhen, map, switchMap, tap, pluck} from "rxjs/operators";
import {from, of, timer} from "rxjs";
import {ajax} from "rxjs/ajax";
import { webSocket } from 'rxjs/webSocket';

import config from "../config";
import {
    messageHasBeenSent,
    messageHasNotBeenSent,
    MessagesActionType,
    messagesChannelHasBeenBroken,
    messageWasReceived,
    previousMessagesWereReceived,
    somethingWentWrongTryingGetPreviousMessages
} from "./messages.actions";
import {decrypt} from "../security";
import {DESCENDING, sortItemsByKey} from "./sorting";

export const sendMessage = action$ =>
    action$.ofType(MessagesActionType.SEND_MESSAGE)
        .pipe(
            mergeMap((action) =>
                from(
                    ajax({
                        url: `${config.API_ORIGIN}/api/v1/message`,
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': sessionStorage.getItem("sessionId")
                        },
                        crossDomain: true,
                        withCredentials: false,
                        body: {
                            message: action.payload.message,
                            user_ids: action.payload.userIds // eslint-disable-line camelcase
                        }
                    })
                ).pipe(
                    mapTo(messageHasBeenSent("Message has been sent.")),
                    catchError(() => {
                        return of(messageHasNotBeenSent("Something went wrong, try again!"));
                    })
                )
            ),
        );

export const getPreviousMessages = action$ =>
    action$.ofType(MessagesActionType.GET_PREVIOUS_MESSAGES)
        .pipe(
            mergeMap(() =>
                from(
                    ajax({
                        url: `${config.API_ORIGIN}/api/v1/message`,
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': sessionStorage.getItem("sessionId")
                        },
                        crossDomain: true,
                        withCredentials: false,
                    })
                ).pipe(
                    pluck("response"),
                    map(messagesData => messagesData.map((messageData) => {
                        return {
                            message: messageData.message,
                            from: messageData.from_user.email,
                            timestamp: messageData.timestamp
                        };
                    })),
                    map((messages) => sortItemsByKey(messages, "timestamp", DESCENDING)),
                    map((sortedMessages) => previousMessagesWereReceived(sortedMessages)),
                    catchError((error) => {
                        console.error(error);
                        return of(somethingWentWrongTryingGetPreviousMessages());
                    })
                )
            ),
        );

export const subscribeMessagesChannel = action$ => {
    let socket$ = null;
    return action$.ofType(MessagesActionType.SUBSCRIBE_MESSAGES_CHANNEL)
        .pipe(
            tap(() => {
                socket$ = webSocket({
                    url: `wss://${config.SOCKET_HOSTNAME}/event-emitter?sid=${sessionStorage.getItem("sessionId")}`,
                    deserializer: function (e) { return e.data; },
                    serializer: function (value) { return value; },
                });
            }),
            switchMap(() =>
                socket$.multiplex(
                    () => {},
                    () => {},
                    () => true
                ).pipe(
                    retryWhen(genericRetryStrategy()),
                    map((encryptedData) => {
                        const decryptedData = JSON.parse(decrypt(
                            sessionStorage.getItem("clientPrivateKey"),
                            sessionStorage.getItem("serverPublicKey"),
                            encryptedData
                        ));
                        return messageWasReceived({
                            message: decryptedData.message,
                            from: decryptedData.from_user.email,
                            timestamp: decryptedData.timestamp
                        });
                    }),
                )
            ),
            catchError(() => {
                return of(messagesChannelHasBeenBroken());
            })
        );
};

const genericRetryStrategy = ({
    maxRetryAttempts = 5,
    scalingDuration = 1000,
    excludedStatusCodes = []
} = {}) => (attempts) => {
    return attempts.pipe(
        mergeMap((error, i) => {
            const retryAttempt = i + 1;
            // if maximum number of retries have been met
            // or response is a status code we don't wish to retry, throw error
            if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
                throw(error);
            }
            console.error(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
            // retry after 1s, 2s, etc...
            return timer(retryAttempt * scalingDuration);
        }),
    );
};
