import initialState from '../state/initialState';
import {MessagesActionType} from './messages.actions';

export default (state = initialState.alertInformationPage, action) => {
    switch (action.type) {
        case MessagesActionType.MESSAGE_WAS_RECEIVED:
            return {...state, messages: [action.payload, ...state.messages], lastMessage: action.payload};
        case MessagesActionType.PREVIOUS_MESSAGES_WERE_RECEIVED:
            return {...state, messages: [...state.messages, ...action.payload]};
        case MessagesActionType.SEND_MESSAGE:
            return {...state, messageHasBeenSent: null};
        case MessagesActionType.MESSAGE_HAS_BEEN_SENT:
            return {...state, messageHasBeenSent: true};
        case MessagesActionType.MESSAGE_HAS_NOT_BEEN_SENT:
            return {...state, messageHasBeenSent: false};
        case MessagesActionType.CLEAR_ALL_THE_MESSAGES:
            return {...initialState.alertInformationPage};
        default:
            return state;
    }
};
