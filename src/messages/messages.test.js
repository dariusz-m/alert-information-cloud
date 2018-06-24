import React from 'react';
import nock from "nock";
import renderer from "react-test-renderer";

import configureStore from "../state";
import config from "../config";
import initialState from "../state/initialState";
import {getPreviousMessages, sendMessage} from "./messages.actions";
import {Messages} from "./messages";


jest.mock('react-list', () => 'div');


describe('Message', () => {
    let store;
    const keys = {
        publicKey: "024eaa6162f2244ff94d8d99009c956eb8c1031087c571e6c6364eeb1cd2c231a3",
        privateKey: "eea1de62230a3f119202a5bc7be4dd9f7fd19c4f83b1c957305db8be18f7b9d7"
    };

    beforeEach(() => {
        store = configureStore();
    });

    it('Messages component renders correctly', () => {
        const users = [
            {
                "id": 45,
                "email": "emial1@ids.pl",
                "firstname": "Qwertyuiop123$",
                "lastname": "Qwertyuiop123$",
                "active": true,
                "createdAt": 1528311326582,
                "lastLoginAt": null
            },
            {
                "id": 42,
                "email": "fdsfsdfs@o2.pl",
                "firstname": "Qwertyuiop123$",
                "lastname": "Qwertyuiop123$",
                "active": false,
                "createdAt": 1528397427078,
                "lastLoginAt": null
            }
        ];
        const messages = [
            {
                timestamp: Date.now(),
                message: "Message body",
                from: "from@o2.pl"
            },
            {
                timestamp: Date.now(),
                message: "Message body 3",
                from: "from3@o2.pl"
            }
        ];
        const actions = {
            sendMessage: jest.fn(),
            subscribeMessagesChannel: jest.fn(),
        };
        const tree = renderer.create(
            <Messages actions={actions} users={users} messages={messages}/>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Message has been sent', (done) => {
        expect.hasAssertions();
        sessionStorage.setItem("sessionId", "sessionId");
        sessionStorage.setItem("clientPrivateKey", keys.privateKey);
        sessionStorage.setItem("serverPublicKey", keys.publicKey);
        nock(config.API_ORIGIN)
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .post(`/api/v1/message`)
            .reply(202, {});
        const expectedState = {
            ...initialState,
            alertInformationPage: {...initialState.alertInformationPage, messageHasBeenSent: true}
        };
        const userIds = [0, 1];

        store.dispatch(sendMessage("Message body", userIds));

        store.subscribe(() => {
            expect(store.getState()).toEqual(expectedState);
            done();
        });
    });


    it('Get previous message', (done) => {
        expect.hasAssertions();
        const responseMessages = [
            {
                "message":"dfdfdfd",
                "from_user":{"id":1,"firstname":"User","lastname":"User","email":"aic2.project@wp.pl"},
                "timestamp":5
            },
            {
                "message":"fvf",
                "from_user":{"id":1,"firstname":"User","lastname":"User","email":"aic2.project@wp.pl"},
                "timestamp":4
            },
            {
                "message":"fvf",
                "from_user":{"id":1,"firstname":"User","lastname":"User","email":"aic2.project@wp.pl"},
                "timestamp":3
            },
            {
                "message":"dfdfd",
                "from_user":{"id":1,"firstname":"User","lastname":"User","email":"aic2.project@wp.pl"},
                "timestamp":2
            },
            {
                "message":"fdfdfd",
                "from_user":{"id":1,"firstname":"User","lastname":"User","email":"aic2.project@wp.pl"},
                "timestamp":1
            }
        ];
        const expectedMessages = responseMessages.map((messageData) => {
            return {
                message: messageData.message,
                from: messageData.from_user.email,
                timestamp: messageData.timestamp
            };
        });
        nock(config.API_ORIGIN)
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get(`/api/v1/message`)
            .reply(200, responseMessages);
        const expectedState = {
            ...initialState,
            alertInformationPage: {...initialState.alertInformationPage, messages: expectedMessages}
        };

        store.dispatch(getPreviousMessages());

        store.subscribe(() => {
            expect(store.getState()).toEqual(expectedState);
            done();
        });
    });
});
