import { createStore, applyMiddleware} from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import reducers from './reducers';
import { rootEpic } from './rootEpic';
import initialState from "./initialState";

const composeEnhancers = composeWithDevTools({});

export const history = createHistory();
const historyMiddleware = routerMiddleware(history);


/**
 * Configure store.
 *
 * @return {Object}
 */
export default function configureStore() {
    const epicMiddleware = createEpicMiddleware();
    const store = createStore(
        reducers,
        initialState,
        composeEnhancers(applyMiddleware(epicMiddleware, historyMiddleware))
    );
    epicMiddleware.run(rootEpic);
    return store;
}
