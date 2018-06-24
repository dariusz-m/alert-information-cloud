import React from 'react';
import renderer from "react-test-renderer";
import nock from 'nock';
import {Router} from "react-router-dom";
import createHistory from 'history/createBrowserHistory';
import { ActionsObservable } from 'redux-observable';
import {toArray} from 'rxjs/operators';

import config from "../config";
import configureStore from "../state";
import initialState from "../state/initialState";
import {login, logout, register} from "./user-account.actions";
import {login as loginEpic, logout as logoutEpic} from "./user-account.epics";
import {Login} from "./login.component";
import {Register} from "./register.component";
import {push} from "react-router-redux";
import {clearAllTheMessages} from "../messages/messages.actions";

const keys = {
    publicKey: "340d2a00048539c2329e276488cdca842b78c60a50f3f3721cd180c6f9486d38",
    privateKey: "043282c0159db1e80b95ca901dd876ce7819b80a86fca87df50fb890f3bac3d038b" +
        "6bee3dbbfd96d7e3be6bf7a65a9e9a21b6dddcfaa5cb27f146de6084b3a2df3"
};
/**
 * Mock generate keys.
 *
 * @returns {Object}
 */
function mockGenerateKeys() {
    return {
        generateKeys: jest.fn().mockImplementation(() => keys),
    };
}
jest.mock('../security/generateKeys', () => mockGenerateKeys());

describe('User Account tests', () => {
    let store;
    const history = createHistory();

    beforeEach(() => {
        store = configureStore();
    });

    it('Login component renders correctly', () => {
        const actions = {
            login: () => {},
        };
        const tree = renderer.create(
            <Router history={history}>
                <Login actions={actions}/>
            </Router>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Register component renders correctly', () => {
        const actions = {
            register: () => {},
        };
        const tree = renderer.create(
            <Router history={history}>
                <Register actions={actions}/>
            </Router>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('User can logout', (done) => {
        expect.hasAssertions();

        sessionStorage.setItem("sessionId", "sessionId");
        sessionStorage.setItem("clientPrivateKey", "private key");
        sessionStorage.setItem("serverPublicKey", "public key");
        nock(config.API_ORIGIN)
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get(`/api/v1/user/logout`)
            .reply(200, {});

        const expectedOutputActions = [push("/login"), clearAllTheMessages()];
        const action$ = ActionsObservable.of(logout());

        logoutEpic(action$).pipe(
            toArray()
        ).subscribe(actualOutputActions => {
            expect(actualOutputActions).toEqual(expectedOutputActions);
            expect(sessionStorage.getItem("clientPrivateKey")).toEqual(null);
            expect(sessionStorage.getItem("serverPublicKey")).toEqual(null);
            expect(sessionStorage.getItem("sessionId")).toEqual(null);
            done();
        });
    });


    it('User can login in', (done) => {
        expect.hasAssertions();

        const expectedSessionId = "sessionId";
        const response = {
            "server_public_key": keys.publicKey,
            "session_id": expectedSessionId,
            "user": {
                "email": "string",
                "firstname": "string",
                "id": 0,
                "lastname": "string"
            }
        };
        nock(config.API_ORIGIN)
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .post(`/api/v1/login`)
            .reply(200, response);
        const expectedOutputActions = [
            push("/"),
        ];
        const action$ = ActionsObservable.of(
            login("mail@gmail.com", "password")
        );

        loginEpic(action$).pipe(
            toArray()
        ).subscribe(actualOutputActions => {
            expect(actualOutputActions).toEqual(expectedOutputActions);
            expect(sessionStorage.getItem("clientPrivateKey")).toEqual(keys.privateKey);
            expect(sessionStorage.getItem("serverPublicKey")).toEqual(keys.publicKey);
            expect(sessionStorage.getItem("sessionId")).toEqual(expectedSessionId);
            done();
        });
    });

    it('User can register in our system', (done) => {
        expect.hasAssertions();
        nock(config.API_ORIGIN)
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .post(`/api/v1/register`)
            .reply(200, {data: {}});
        const expectedState = {
            ...initialState,
            userAccount: {
                ...initialState.userAccount,
                registerPage: {
                    ...initialState.userAccount.registerPage,
                    isUserRegistered: true
                }
            }
        };

        store.dispatch(register("mail@gmail.com", "password", "name", "surname"));

        store.subscribe(() => {
            expect(store.getState()).toEqual(expectedState);
            done();
        });
    });

});

