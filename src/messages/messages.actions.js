export const MessagesActionType = {
    SEND_MESSAGE: 'SEND_MESSAGE',
    MESSAGE_HAS_BEEN_SENT: 'MESSAGE_HAS_BEEN_SENT',
    MESSAGE_HAS_NOT_BEEN_SENT: 'MESSAGE_HAS_NOT_BEEN_SENT',
    SUBSCRIBE_MESSAGES_CHANNEL: 'SUBSCRIBE_MESSAGES_CHANNEL',
    MESSAGES_CHANNEL_HAS_BEEN_BROKEN: 'MESSAGES_CHANNEL_HAS_BEEN_BROKEN',
    MESSAGE_WAS_RECEIVED: 'MESSAGE_WAS_RECEIVED',
    CLEAR_ALL_THE_MESSAGES: 'CLEAR_ALL_THE_MESSAGES',
    GET_PREVIOUS_MESSAGES: 'GET_PREVIOUS_MESSAGES',
    PREVIOUS_MESSAGES_WERE_RECEIVED: 'PREVIOUS_MESSAGES_WERE_RECEIVED',
    SOMETHING_WENT_WRONG_TRYING_GET_PREVIOUS_MESSAGES: 'SOMETHING_WENT_WRONG_TRYING_GET_PREVIOUS_MESSAGES',
};

export const sendMessage = (message, userIds) => {
    return {
        type: MessagesActionType.SEND_MESSAGE,
        payload: {
            message,
            userIds
        }
    };
};

export const messageHasBeenSent = () => {
    return {
        type: MessagesActionType.MESSAGE_HAS_BEEN_SENT,
    };
};

export const messageHasNotBeenSent = () => {
    return {
        type: MessagesActionType.MESSAGE_HAS_NOT_BEEN_SENT,
    };
};

export const subscribeMessagesChannel = () => {
    return {
        type: MessagesActionType.SUBSCRIBE_MESSAGES_CHANNEL,
    };
};

export const messagesChannelHasBeenBroken = () => {
    return {
        type: MessagesActionType.MESSAGES_CHANNEL_HAS_BEEN_BROKEN,
    };
};

export const messageWasReceived = (messageData) => {
    return {
        type: MessagesActionType.MESSAGE_WAS_RECEIVED,
        payload: messageData
    };
};

export const clearAllTheMessages = () => {
    return {
        type: MessagesActionType.CLEAR_ALL_THE_MESSAGES,
    };
};

export const getPreviousMessages = () => {
    return {
        type: MessagesActionType.GET_PREVIOUS_MESSAGES,
    };
};

export const previousMessagesWereReceived = (messages) => {
    return {
        type: MessagesActionType.PREVIOUS_MESSAGES_WERE_RECEIVED,
        payload: messages,
    };
};

export const somethingWentWrongTryingGetPreviousMessages = () => {
    return {
        type: MessagesActionType.SOMETHING_WENT_WRONG_TRYING_GET_PREVIOUS_MESSAGES,
    };
};

