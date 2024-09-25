import React__default from 'react';
import { Flex, Text, Button } from '@aws-amplify/ui-react';
import { AlertIcon } from '@aws-amplify/ui-react/internal';
import '../service/machine/machine.mjs';
import '../service/types/liveness.mjs';
import { LivenessErrorState } from '../service/types/error.mjs';
import '@tensorflow/tfjs-core';
import '@tensorflow-models/face-detection';
import '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-cpu';
import '@aws-amplify/core/internals/utils';
import '@aws-sdk/client-rekognitionstreaming';
import '../service/utils/createStreamingClient/createStreamingClient.mjs';
import '../service/utils/freshnessColorDisplay.mjs';
import { Toast } from './Toast.mjs';
import { Overlay } from './Overlay.mjs';
import { defaultErrorDisplayText } from '../displayText.mjs';
import { LivenessClassNames } from '../types/classNames.mjs';

const renderToastErrorModal = (props) => {
    const { error: errorState, displayText } = props;
    const { connectionTimeoutHeaderText, connectionTimeoutMessageText, errorLabelText, timeoutHeaderText, timeoutMessageText, faceDistanceHeaderText, faceDistanceMessageText, multipleFacesHeaderText, multipleFacesMessageText, clientHeaderText, clientMessageText, serverHeaderText, serverMessageText, } = displayText;
    let heading;
    let message;
    switch (errorState) {
        case LivenessErrorState.CONNECTION_TIMEOUT:
            heading = connectionTimeoutHeaderText;
            message = connectionTimeoutMessageText;
            break;
        case LivenessErrorState.TIMEOUT:
            heading = timeoutHeaderText;
            message = timeoutMessageText;
            break;
        case LivenessErrorState.FACE_DISTANCE_ERROR:
            heading = faceDistanceHeaderText;
            message = faceDistanceMessageText;
            break;
        case LivenessErrorState.MULTIPLE_FACES_ERROR:
            heading = multipleFacesHeaderText;
            message = multipleFacesMessageText;
            break;
        case LivenessErrorState.RUNTIME_ERROR:
            heading = clientHeaderText;
            message = clientMessageText;
            break;
        case LivenessErrorState.SERVER_ERROR:
        default:
            heading = serverHeaderText;
            message = serverMessageText;
    }
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement(Flex, { className: LivenessClassNames.ErrorModal },
            React__default.createElement(AlertIcon, { ariaLabel: errorLabelText, role: "img", variation: "error" }),
            React__default.createElement(Text, { className: LivenessClassNames.ErrorModalHeading, id: "amplify-liveness-error-heading" }, heading)),
        React__default.createElement(Text, { id: "amplify-liveness-error-message" }, message)));
};
const renderErrorModal = ({ errorState, overrideErrorDisplayText, }) => {
    const displayText = {
        ...defaultErrorDisplayText,
        ...overrideErrorDisplayText,
    };
    if (errorState === LivenessErrorState.CAMERA_ACCESS_ERROR ||
        errorState === LivenessErrorState.CAMERA_FRAMERATE_ERROR ||
        errorState === LivenessErrorState.MOBILE_LANDSCAPE_ERROR) {
        return null;
    }
    else {
        return renderToastErrorModal({
            error: errorState,
            displayText,
        });
    }
};
const FaceLivenessErrorModal = (props) => {
    const { children, onRetry, displayText: overrideErrorDisplayText } = props;
    const displayText = {
        ...defaultErrorDisplayText,
        ...overrideErrorDisplayText,
    };
    const { tryAgainText } = displayText;
    return (React__default.createElement(Overlay, { className: LivenessClassNames.OpaqueOverlay },
        React__default.createElement(Toast, { "aria-labelledby": "amplify-liveness-error-heading", "aria-describedby": "amplify-liveness-error-message", role: "alertdialog" },
            children,
            React__default.createElement(Flex, { justifyContent: "center" },
                React__default.createElement(Button, { variation: "primary", type: "button", onClick: onRetry }, tryAgainText)))));
};

export { FaceLivenessErrorModal, renderErrorModal };
