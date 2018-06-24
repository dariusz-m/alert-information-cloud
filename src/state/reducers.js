import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import userAccountReducer from '../user-account/user-account.reducer';
import usersReducer from '../users/users.reducer';
import alertInformationPageReducer from '../messages/messages.reducer';

export default combineReducers({
    router: routerReducer,
    userAccount: userAccountReducer,
    users: usersReducer,
    alertInformationPage: alertInformationPageReducer,
});
