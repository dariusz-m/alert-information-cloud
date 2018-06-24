import './style.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import {Provider} from "react-redux";
import { ConnectedRouter } from 'react-router-redux';

import {history} from "./state";
import configureStore from "./state";

export const store = configureStore();

const AlertInformationCloud = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>
);

ReactDOM.render(<AlertInformationCloud/>, document.getElementById("app"));
