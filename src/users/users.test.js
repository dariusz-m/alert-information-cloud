import configureStore from "../state";
import nock from "nock";
import config from "../config";
import initialState from "../state/initialState";
import {loadUsers} from "./users.actions";


describe('Users', () => {
    let store;

    beforeEach(() => {
        store = configureStore();
    });


    it('Load users list', (done) => {
        expect.hasAssertions();
        const userList = [
            {
                "id":41,
                "email":"emial1@ids.pl",
                "firstname":"Qwertyuiop123$",
                "lastname":"Qwertyuiop123$",
                "active":true,
                "createdAt":1528311326582,
                "lastLoginAt":null
            },
            {
                "id":42,
                "email":"gfgfgfg@o2.pl",
                "firstname":"Qwertyuiop123$",
                "lastname":"Qwertyuiop123$",
                "active":false,
                "createdAt":1528397427078,
                "lastLoginAt":null
            }
        ];
        sessionStorage.setItem("sessionId", "sessionId");
        nock(config.API_ORIGIN)
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get(`/api/v1/user`)
            .reply(200, {user_list: userList}); // eslint-disable-line camelcase
        const expectedState = {
            ...initialState,
            users: userList
        };

        store.dispatch(loadUsers());

        store.subscribe(() => {
            expect(store.getState()).toEqual(expectedState);
            done();
        });
    });

});
