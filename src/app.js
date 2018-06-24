import 'bootstrap';

import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import {hot} from "react-hot-loader";

import Login from "./user-account/login.component";
import Register from "./user-account/register.component";
import {isUserAuthenticated} from "./user-account/auth";
import Messages from "./messages/messages";

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isUserAuthenticated() === true
            ? <Component {...props} />
            : <Redirect to='/login' />
    )}/>
);

/**
 * Application component
 */
class App extends React.Component {
    /**
     * Render
     *
     * @returns {React.Element}
     */
    render() {
        return (
            <div className={"container"}>
                <Switch>
                    <ProtectedRoute exact path={"/"} component={Messages}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Redirect to="/"/>
                </Switch>
            </div>
        );
    }
}

export default hot(module)(App);
