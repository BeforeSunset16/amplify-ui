import React__default from 'react';
import { ComponentClassName } from '@aws-amplify/ui';
import { View, Flex } from '@aws-amplify/ui-react';
import { CancelButton } from './CancelButton.mjs';
import '../service/machine/machine.mjs';
import '../service/types/liveness.mjs';
import '@tensorflow/tfjs-core';
import '@tensorflow-models/face-detection';
import '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-cpu';
import '@aws-amplify/core/internals/utils';
import '@aws-sdk/client-rekognitionstreaming';
import '../service/utils/createStreamingClient/createStreamingClient.mjs';
import '../service/utils/freshnessColorDisplay.mjs';
import '@xstate/react';
import '../providers/FaceLivenessDetectorProvider.mjs';
import { LivenessClassNames } from '../types/classNames.mjs';
import { RecordingIcon } from './RecordingIcon.mjs';
import { LivenessIconWithPopover } from './LivenessIconWithPopover.mjs';

const DefaultPhotosensitiveWarning = ({ bodyText, headingText, infoText, labelText, }) => {
    return (React__default.createElement(Flex, { className: `${ComponentClassName.Alert} ${LivenessClassNames.StartScreenWarning}`, style: { zIndex: '3' } },
        React__default.createElement(View, { flex: "1" },
            React__default.createElement(View, { className: ComponentClassName.AlertHeading }, headingText),
            React__default.createElement(View, { className: ComponentClassName.AlertBody }, bodyText)),
        React__default.createElement(LivenessIconWithPopover, { labelText: labelText, headingText: headingText }, infoText)));
};
const DefaultRecordingIcon = ({ recordingIndicatorText, }) => {
    return (React__default.createElement(View, { className: LivenessClassNames.RecordingIconContainer },
        React__default.createElement(RecordingIcon, null, recordingIndicatorText)));
};
const DefaultCancelButton = ({ cancelLivenessCheckText, }) => {
    return (React__default.createElement(View, { className: LivenessClassNames.CancelContainer },
        React__default.createElement(CancelButton, { ariaLabel: cancelLivenessCheckText })));
};

export { DefaultCancelButton, DefaultPhotosensitiveWarning, DefaultRecordingIcon };
