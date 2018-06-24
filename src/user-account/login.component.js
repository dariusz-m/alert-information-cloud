import './user-account.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";

import {login} from "./user-account.actions";

/**
 * Login component.
 */
export class Login extends React.Component {
    /**
     * Constructor.
     *
     * @param {Object} props: Component configuration.
     */
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
        };

        this.emailChange = this.emailChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.login = this.login.bind(this);
    }

    /**
     * On email change.
     *
     * @param {Event} changeEvent: Change event.
     */
    emailChange(changeEvent) {
        this.setState({email: changeEvent.target.value});
    }
    /**
     * On password change.
     *
     * @param {Event} changeEvent: Change event.
     */
    passwordChange(changeEvent) {
        this.setState({password: changeEvent.target.value});
    }
    /**
     * Login.
     *
     * @param {Event} clickEvent: Click event.
     */
    login(clickEvent) {
        this.props.actions.login(this.state.email, this.state.password);
        clickEvent.preventDefault();
    }

    /**
     * Render component.
     *
     * @returns {React.Element}
     */
    render() {
        return (
            <form className="form-signin">
                <img className="mb-4" src="" alt="" width="72" height="72"/>
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required
                    autoFocus value={this.state.email} onChange={this.emailChange}/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password"
                    required value={this.state.password} onChange={this.passwordChange}/>
                <p>No account? <Link to={"/register"}><strong>Create one!</strong></Link></p>
                <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.login}>Sign in</button>
                {this.props.errorMessage?
                    <div className="alert alert-danger">
                        <strong>Login failed!</strong> {this.props.errorMessage}
                    </div> : null
                }
            </form>
        );
    }
}

Login.propTypes = {
    errorMessage: PropTypes.string,
    actions: PropTypes.shape({
        login: PropTypes.func.isRequired,
    }),
};

/**
 * Map state to props.
 *
 * @param {Object} state: State of application
 *
 * @returns {Object}
 */
function mapStateToProps(state) {
    return {
        errorMessage: state.userAccount.loginPage.errorMessage,
    };
}

/**
 * Map state to props.
 *
 * @param {Object} dispatch: Dispatch
 *
 * @returns {Object}
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            login: login,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
