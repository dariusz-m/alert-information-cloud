import React from "react";
import Notification from "react-web-notification";
import PropTypes from "prop-types";

/**
 * Native notification
 */
export class MessageNotification extends React.Component {
    /**
     * Constructor.
     *
     * @param {Object} props: Component configuration.
     */
    constructor(props) {
        super(props);

        this.state = {
            ignore: true,
            message: null,
            options: null
        };
    }

    /**
     * Component will receive props
     *
     * @param {Object} nextProps: Next component configuration.
     */
    componentWillReceiveProps(nextProps) {
        if(this.state.message !== nextProps.message) {
            this.setState({message: nextProps.message, options: prepareOptions(nextProps.message)});
        }
    }
    /**
     * Handle permission granted.
     */
    handlePermissionGranted() {
        this.setState({
            ignore: false
        });
    }
    /**
     * Handle permission denied.
     */
    handlePermissionDenied() {
        this.setState({
            ignore: true
        });
    }
    /**
     * Handle not supported.
     */
    handleNotSupported() {
        this.setState({
            ignore: true
        });
    }
    /**
     * Handle notification on click.
     */
    handleNotificationOnClick() {}
    /**
     * Handle notification on error.
     */
    handleNotificationOnError() {}
    /**
     * Handle notification on close.
     */
    handleNotificationOnClose() {}
    /**
     * Handle notification on show.
     */
    handleNotificationOnShow() {
        this.playSound();
    }
    /**
     * Play sound.
     */
    playSound() {
        document.getElementById('sound').play();
    }

    /**
     * Render component.
     *
     * @returns {React.Element}
     */
    render() {
        return (
            <div>
                <Notification
                    ignore={this.state.ignore || this.state.message === null}
                    notSupported={this.handleNotSupported.bind(this)}
                    onPermissionGranted={this.handlePermissionGranted.bind(this)}
                    onPermissionDenied={this.handlePermissionDenied.bind(this)}
                    onShow={this.handleNotificationOnShow.bind(this)}
                    onClick={this.handleNotificationOnClick.bind(this)}
                    onClose={this.handleNotificationOnClose.bind(this)}
                    onError={this.handleNotificationOnError.bind(this)}
                    timeout={5000}
                    title={"New message"}
                    options={this.state.options}
                />
                <audio id='sound' preload='auto'>
                    <source
                        src='https://georgeosddev.github.io/react-web-notification/example/sound.mp3'
                        type='audio/mpeg'
                    />
                    <source
                        src='https://georgeosddev.github.io/react-web-notification/example/sound.ogg'
                        type='audio/ogg'
                    />
                    <embed
                        hidden='true'
                        autostart='false'
                        loop='false'
                        src='https://georgeosddev.github.io/react-web-notification/example/sound.mp3'
                    />
                </audio>
            </div>
        );
    }
}


MessageNotification.propTypes = {
    message: PropTypes.shape({
        timestamp: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired,
    })
};

const prepareOptions = (message) => {
    const now = message.timestamp;
    const body = message.message + "\n\n" + new Date(message.timestamp);
    const tag = now;
    const icon = 'https://georgeosddev.github.io/react-web-notification/example/Notifications_button_24.png';
    return {
        tag: tag,
        body: body,
        icon: icon,
        lang: 'en',
        dir: 'ltr',
        sound: 'https://georgeosddev.github.io/react-web-notification/example/sound.mp3'
    };
};
