import './user-account.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";

import {register} from "./user-account.actions";

/**
 * Register component.
 */
export class Register extends React.Component {
    /**
     * Constructor.
     *
     * @param {Object} props: Component configuration.
     */
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            name: "",
            surname: "",
            password: ""
        };

        this.emailChange = this.emailChange.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.surnameChange = this.surnameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.register = this.register.bind(this);
    }

    /**
     * Component will receive props
     *
     * @param {Object} nextProps: Next component configuration.
     */
    componentWillReceiveProps(nextProps) {
        if(nextProps.isUserRegistered) {
            this.setState({
                email: "",
                name: "",
                surname: "",
                password: ""
            });
        }
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
     * On name change.
     *
     * @param {Event} changeEvent: Change event.
     */
    nameChange(changeEvent) {
        this.setState({name: changeEvent.target.value});
    }
    /**
     * On name change.
     *
     * @param {Event} changeEvent: Change event.
     */
    surnameChange(changeEvent) {
        this.setState({surname: changeEvent.target.value});
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
     * Register.
     *
     * @param {Event} clickEvent: Click event.
     */
    register(clickEvent) {
        this.props.actions.register(this.state.email, this.state.password, this.state.name, this.state.surname);
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
                <h1 className="h3 mb-3 font-weight-normal">Create account</h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required
                    autoFocus value={this.state.email} onChange={this.emailChange}/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password"
                    required value={this.state.password} onChange={this.passwordChange}/>
                <label htmlFor="inputName" className="sr-only">Name</label>
                <input type="text" id="inputName" className="form-control" placeholder="Name"
                    required value={this.state.name} onChange={this.nameChange}/>
                <label htmlFor="inputSurname" className="sr-only">Surname</label>
                <input type="text" id="inputSurname" className="form-control" placeholder="Surname"
                    required value={this.state.surname} onChange={this.surnameChange}/>
                <p>Back to <Link to={"/login"}><strong>Login page</strong></Link></p>
                <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.register}>
                    Sign up
                </button>
                {this.props.errorMessage?
                    <div className="alert alert-danger">
                        <strong>Registration failed!</strong> {this.props.errorMessage}
                    </div> : null
                }
                {this.props.isUserRegistered?
                    <div className="alert alert-success">
                        <strong>Success!</strong> You have been registered.
                    </div>: null
                }
            </form>
        );
    }
}

Register.propTypes = {
    errorMessage: PropTypes.string,
    isUserRegistered: PropTypes.bool,
    actions: PropTypes.shape({
        register: PropTypes.func.isRequired,
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
        errorMessage: state.userAccount.registerPage.errorMessage,
        isUserRegistered: state.userAccount.registerPage.isUserRegistered,
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
            register: register,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
