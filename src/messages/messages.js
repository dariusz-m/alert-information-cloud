import "./messages.scss";

import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import ReactList from "react-list";
import TimeAgo from "react-timeago";

import MultiSelect from "../multiselect/multiSelect";
import {sendMessage, subscribeMessagesChannel} from "./messages.actions";
import {MessageNotification} from "../notification/notification";
import {logout} from "../user-account/user-account.actions";

/**
 * Main component, handling messages
 */
export class Messages extends React.Component {
    /**
     * Constructor.
     *
     * @param {Object} props: Component configuration.
     */
    constructor(props) {
        super(props);

        this.state = {
            selectedUsersIds: [],
            message: "",
            selectedMessage: null
        };

        this.onSelectedOptionsChange = this.onSelectedOptionsChange.bind(this);
        this.onMessageBodyChange = this.onMessageBodyChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.renderMessage = this.renderMessage.bind(this);
        this.displayMessageDetails = this.displayMessageDetails.bind(this);
    }

    /**
     * On selected options change
     *
     * @param {Array} selectedUsersIds: Selected users ids
     */
    onSelectedOptionsChange(selectedUsersIds) {
        this.setState({
            selectedUsersIds: selectedUsersIds
        });
    }

    /**
     * On message body change.
     *
     * @param {Event} changeEvent: Change event.
     */
    onMessageBodyChange(changeEvent) {
        this.setState({message: changeEvent.target.value});
    }

    /**
     * On message body change.
     *
     * @param {Event} clickEvent: Click event.
     */
    sendMessage(clickEvent) {
        if (this.state.selectedUsersIds.length > 0) {
            this.props.actions.sendMessage(this.state.message, this.state.selectedUsersIds);
        }
        clickEvent.preventDefault();
    }

    /**
     * Component did mount.
     */
    componentDidMount() {
        this.props.actions.subscribeMessagesChannel();
    }

    /**
     * Display message details
     *
     * @param {Object} message: Message
     * */
    displayMessageDetails(message) {
        this.setState({selectedMessage: message});
    }

    /**
     * Render component.
     *
     * @param {number} index: Index of message
     *
     * @returns {React.Element}
     */
    renderMessage(index) {
        return (
            <div
                key={this.props.messages[index].timestamp}
                className="result-block"
                onClick={this.displayMessageDetails.bind(this, this.props.messages[index])}
            >
                <div className={`data-piece`}>
                    <span className="result-title-side">
                        <TimeAgo date={this.props.messages[index].timestamp}/>
                    </span>
                </div>
                <div className={`data-piece`}>
                    <span className={`icon flow from`} id="icon-direction"/>
                    <a className="link result-attr-2"> {this.props.messages[index].from}</a>
                    <span className="icon href"/>
                </div>
                <div className={`data-piece`}>
                    <a className="link result-attr-3 truncate">
                        <span className="icon hashtag"/>
                        {this.props.messages[index].message}</a>
                    <span className="icon href"/>
                </div>
            </div>

        );
    }

    /**
     * Render component.
     *
     * @returns {React.Element}
     */
    render() {
        const options = this.props.users.map((user) => {
            return {id: user.id, text: user.email};
        });

        return (
            <div>
                <button className={"btn btn-danger float-right"} onClick={this.props.actions.logout}>Logout</button>
                <div className={"md-12 messages"}>
                    <div className="scrollable-wrapper">
                        <ReactList
                            itemRenderer={this.renderMessage}
                            length={this.props.messages.length}
                            pageSize={1}
                        />
                    </div>
                    {this.state.selectedMessage ?
                        <div className={"selected-message"}>
                            <h4><strong>{this.state.selectedMessage.from}</strong> -- sent you message</h4>
                            <p>{this.state.selectedMessage.message}</p>
                            <span>{new Date(this.state.selectedMessage.timestamp).toString()}</span>
                        </div>
                        : null
                    }
                </div>
                <div className={"md-12"}>
                    <MultiSelect
                        options={options}
                        selectedOptionsIds={this.state.selectedUsersIds}
                        updateSelectedOptions={this.onSelectedOptionsChange}
                    />
                    <div className="input-group mb-3">
                        <input
                            type="text" className="form-control" placeholder="Message body..."
                            aria-label="Message body..." aria-describedby="basic-addon2"
                            value={this.state.message} onChange={this.onMessageBodyChange}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                disabled={!this.state.message}
                                onClick={this.sendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                    <div className="md-12">
                        {(() => {
                            switch(this.props.messageHasBeenSent) {
                                case false:
                                    return(
                                        <div className="alert alert-danger">
                                            <div>
                                                <strong>Something went wrong!</strong> Try again.
                                            </div>
                                        </div>
                                    );
                                case true:
                                    return(
                                        <div className="alert alert-success">
                                            <strong>Success!</strong> Message has been sent.
                                        </div>
                                    );
                                default:
                                    return this.state.selectedUsersIds.length === 0 ?
                                        <div className="alert alert-info">
                                            <p>Select at least one recipient to send message.</p>
                                        </div>
                                        : null;

                            }
                        })()}
                    </div>
                </div>
                <MessageNotification message={this.props.lastMessage}/>
            </div>
        );
    }
}


Messages.propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
        firstname: PropTypes.string.isRequired,
        lastname: PropTypes.string.isRequired,
    })).isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
        timestamp: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired,
    })).isRequired,
    lastMessage: PropTypes.shape({
        timestamp: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired,
    }),
    messageHasBeenSent: PropTypes.bool,
    actions: PropTypes.shape({
        sendMessage: PropTypes.func.isRequired,
        subscribeMessagesChannel: PropTypes.func.isRequired
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
        users: state.users,
        messages: state.alertInformationPage.messages,
        lastMessage: state.alertInformationPage.lastMessage,
        messageHasBeenSent: state.alertInformationPage.messageHasBeenSent,
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
            sendMessage: sendMessage,
            subscribeMessagesChannel: subscribeMessagesChannel,
            logout: logout,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
