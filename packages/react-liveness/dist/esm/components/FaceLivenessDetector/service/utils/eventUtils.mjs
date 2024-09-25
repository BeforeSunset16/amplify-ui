import { WEBSOCKET_CONNECTION_TIMEOUT_MESSAGE } from './createStreamingClient/CustomWebSocketFetchHandler.mjs';

const isServerSesssionInformationEvent = (value) => {
    return !!value
        ?.ServerSessionInformationEvent;
};
const isConnectionTimeoutError = (error) => {
    const { message } = error;
    return message.includes(WEBSOCKET_CONNECTION_TIMEOUT_MESSAGE);
};
const isDisconnectionEvent = (value) => {
    return !!value
        ?.DisconnectionEvent;
};
const isValidationExceptionEvent = (value) => {
    return !!value
        ?.ValidationException;
};
const isInternalServerExceptionEvent = (value) => {
    return !!value
        ?.InternalServerException;
};
const isThrottlingExceptionEvent = (value) => {
    return !!value
        ?.ThrottlingException;
};
const isServiceQuotaExceededExceptionEvent = (value) => {
    return !!value
        ?.ServiceQuotaExceededException;
};
const isInvalidSignatureRegionException = (error) => {
    const { message, name } = error;
    return (name === 'InvalidSignatureException' && message.includes('valid region'));
};

export { isConnectionTimeoutError, isDisconnectionEvent, isInternalServerExceptionEvent, isInvalidSignatureRegionException, isServerSesssionInformationEvent, isServiceQuotaExceededExceptionEvent, isThrottlingExceptionEvent, isValidationExceptionEvent };
