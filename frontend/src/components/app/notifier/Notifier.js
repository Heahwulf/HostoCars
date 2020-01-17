import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { Collapse } from '@material-ui/core';
import { withSnackbar } from 'notistack';

import { Notification } from 'components';
import { dequeueNotificationAction } from 'actions';

/**
 * Manager for the application's notifications.
 */
class Notifier extends PureComponent {
    displayed = [];

    /**
     * Method called when the component did update.
     */
    componentDidUpdate() {
        const { closeSnackbar, dequeueNotification, enqueueSnackbar, notifications } = this.props;

        // Iterates over the notifications to update their statuses
        notifications.forEach(({ dismissed = false, key, message, options = {} }) => {
            // If the notification is to be dismissed, closes it
            if (dismissed) {
                closeSnackbar(key);
                return;
            }

            // If the notification is already displayed, goes directly to the next one
            if (this.displayed.includes(key)) {
                return;
            }

            // Defines the notification close event action
            const handleClose = () => {
                dequeueNotification(key);
            };

            // Defines the notification exit event action
            const handleExit = () => {
                dequeueNotification(key);
                this.displayed = this.displayed.filter(k => key !== k);
            };

            const { content, variant } = options;

            // Defines the notification to display
            const notification = (<Notification message={message} onClose={handleClose} variant={variant}>
                {content}
            </Notification>);

            // Enqueues the notification
            enqueueSnackbar(message, {
                ...options,
                key,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                },
                autoHideDuration: 10000,
                content: notification,
                onExited: handleExit,
                TransitionComponent: Collapse
            });

            // Adds the notification key to the list of displayed ones
            this.displayed = [ ...this.displayed, key ];
        });
    };

    /**
     * Render method (doesn't render anything, since this is not a graphical component).
     */
    render() {
        return null;
    }
}

const mapStateToProps = state => ({
    notifications: state.notifications.notifications
});

const mapDispatchToProps = dispatch => bindActionCreators({
    dequeueNotification: dequeueNotificationAction
}, dispatch);

Notifier.prototypes = {
    closeSnackbar: PropTypes.func.isRequired,
    dequeueNotification: PropTypes.func.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape({
        dismissed: PropTypes.bool,
        key: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        options: PropTypes.objectOf(PropTypes.any).isRequired
    }))
};

Notifier.defaultProps = {
    notifications: []
};

export default withSnackbar(connect(mapStateToProps, mapDispatchToProps)(Notifier));
