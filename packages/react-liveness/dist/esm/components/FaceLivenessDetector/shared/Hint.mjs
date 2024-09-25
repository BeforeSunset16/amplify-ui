import * as React from 'react';
import { VisuallyHidden, View } from '@aws-amplify/ui-react';
import '../service/machine/machine.mjs';
import { FaceMatchState, IlluminationState } from '../service/types/liveness.mjs';
import '@tensorflow/tfjs-core';
import '@tensorflow-models/face-detection';
import '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-cpu';
import '@aws-amplify/core/internals/utils';
import '@aws-sdk/client-rekognitionstreaming';
import '../service/utils/createStreamingClient/createStreamingClient.mjs';
import '../service/utils/freshnessColorDisplay.mjs';
import { useLivenessActor } from '../hooks/useLivenessActor.mjs';
import { createLivenessSelector, useLivenessSelector } from '../hooks/useLivenessSelector.mjs';
import '@aws-amplify/ui';
import { Toast } from './Toast.mjs';
import { ToastWithLoader } from './ToastWithLoader.mjs';

const selectErrorState = createLivenessSelector((state) => state.context.errorState);
const selectFaceMatchState = createLivenessSelector((state) => state.context.faceMatchAssociatedParams.faceMatchState);
const selectIlluminationState = createLivenessSelector((state) => state.context.faceMatchAssociatedParams.illuminationState);
const selectIsFaceFarEnoughBeforeRecording = createLivenessSelector((state) => state.context.isFaceFarEnoughBeforeRecording);
const selectFaceMatchStateBeforeStart = createLivenessSelector((state) => state.context.faceMatchStateBeforeStart);
const selectFaceMatchPercentage = createLivenessSelector((state) => state.context.faceMatchAssociatedParams?.faceMatchPercentage);
const DefaultToast = ({ text, isInitial = false, }) => {
    return (React.createElement(Toast, { size: "large", variation: "primary", isInitial: isInitial },
        React.createElement(View, { "aria-live": "assertive" }, text)));
};
const Hint = ({ hintDisplayText }) => {
    const [state] = useLivenessActor();
    // NOTE: Do not change order of these selectors as the unit tests depend on this order
    const errorState = useLivenessSelector(selectErrorState);
    const faceMatchState = useLivenessSelector(selectFaceMatchState);
    const illuminationState = useLivenessSelector(selectIlluminationState);
    const faceMatchStateBeforeStart = useLivenessSelector(selectFaceMatchStateBeforeStart);
    const isFaceFarEnoughBeforeRecordingState = useLivenessSelector(selectIsFaceFarEnoughBeforeRecording);
    const faceMatchPercentage = useLivenessSelector(selectFaceMatchPercentage);
    const isCheckFaceDetectedBeforeStart = state.matches('checkFaceDetectedBeforeStart') ||
        state.matches('detectFaceBeforeStart');
    const isCheckFaceDistanceBeforeRecording = state.matches('checkFaceDistanceBeforeRecording') ||
        state.matches('detectFaceDistanceBeforeRecording');
    const isStartView = state.matches('start') || state.matches('userCancel');
    const isRecording = state.matches('recording');
    const isNotRecording = state.matches('notRecording');
    const isUploading = state.matches('uploading');
    const isCheckSuccessful = state.matches('checkSucceeded');
    const isCheckFailed = state.matches('checkFailed');
    const isFlashingFreshness = state.matches({
        recording: 'flashFreshnessColors',
    });
    const FaceMatchStateStringMap = {
        [FaceMatchState.CANT_IDENTIFY]: hintDisplayText.hintCanNotIdentifyText,
        [FaceMatchState.FACE_IDENTIFIED]: hintDisplayText.hintTooFarText,
        [FaceMatchState.TOO_MANY]: hintDisplayText.hintTooManyFacesText,
        [FaceMatchState.TOO_FAR]: hintDisplayText.hintTooFarText,
        [FaceMatchState.MATCHED]: hintDisplayText.hintHoldFaceForFreshnessText,
        [FaceMatchState.OFF_CENTER]: hintDisplayText.hintFaceOffCenterText,
    };
    const IlluminationStateStringMap = {
        [IlluminationState.BRIGHT]: hintDisplayText.hintIlluminationTooBrightText,
        [IlluminationState.DARK]: hintDisplayText.hintIlluminationTooDarkText,
        [IlluminationState.NORMAL]: hintDisplayText.hintIlluminationNormalText,
    };
    if (isStartView) {
        return (React.createElement(React.Fragment, null,
            React.createElement(VisuallyHidden, { role: "alert" }, hintDisplayText.hintCenterFaceInstructionText),
            React.createElement(DefaultToast, { text: hintDisplayText.hintCenterFaceText, isInitial: true })));
    }
    if (errorState ?? (isCheckFailed || isCheckSuccessful)) {
        return null;
    }
    if (!isRecording) {
        if (isCheckFaceDetectedBeforeStart) {
            if (faceMatchStateBeforeStart === FaceMatchState.TOO_MANY) {
                return React.createElement(DefaultToast, { text: hintDisplayText.hintTooManyFacesText });
            }
            return (React.createElement(DefaultToast, { text: hintDisplayText.hintMoveFaceFrontOfCameraText }));
        }
        // Specifically checking for false here because initially the value is undefined and we do not want to show the instruction
        if (isCheckFaceDistanceBeforeRecording &&
            isFaceFarEnoughBeforeRecordingState === false) {
            return React.createElement(DefaultToast, { text: hintDisplayText.hintTooCloseText });
        }
        if (isNotRecording) {
            return (React.createElement(ToastWithLoader, { displayText: hintDisplayText.hintConnectingText }));
        }
        if (isUploading) {
            return (React.createElement(React.Fragment, null,
                React.createElement(VisuallyHidden, { "aria-live": "assertive" }, hintDisplayText.hintCheckCompleteText),
                React.createElement(ToastWithLoader, { displayText: hintDisplayText.hintVerifyingText })));
        }
        if (illuminationState && illuminationState !== IlluminationState.NORMAL) {
            return (React.createElement(DefaultToast, { text: IlluminationStateStringMap[illuminationState] }));
        }
    }
    if (isFlashingFreshness) {
        return React.createElement(DefaultToast, { text: hintDisplayText.hintHoldFaceForFreshnessText });
    }
    if (isRecording && !isFlashingFreshness) {
        // During face matching, we want to only show the
        // TOO_FAR texts. For FACE_IDENTIFIED, CANT_IDENTIFY, TOO_MANY
        // we are defaulting to the TOO_FAR text (for now).
        let resultHintString = FaceMatchStateStringMap[FaceMatchState.TOO_FAR];
        if (faceMatchState === FaceMatchState.MATCHED) {
            resultHintString = FaceMatchStateStringMap[faceMatchState];
        }
        // If the face is outside the oval set the aria-label to a string about centering face in oval
        let a11yHintString = resultHintString;
        if (faceMatchState === FaceMatchState.OFF_CENTER) {
            a11yHintString = FaceMatchStateStringMap[faceMatchState];
        }
        else if (
        // If the face match percentage reaches 50% append it to the a11y label
        faceMatchState === FaceMatchState.TOO_FAR &&
            faceMatchPercentage > 50) {
            a11yHintString = hintDisplayText.hintMatchIndicatorText;
        }
        return (React.createElement(Toast, { size: "large", variation: 'primary' },
            React.createElement(VisuallyHidden, { "aria-live": "assertive" }, a11yHintString),
            React.createElement(View, { "aria-label": a11yHintString }, resultHintString)));
    }
    return null;
};

export { Hint, selectErrorState, selectFaceMatchState, selectFaceMatchStateBeforeStart, selectIlluminationState, selectIsFaceFarEnoughBeforeRecording };
