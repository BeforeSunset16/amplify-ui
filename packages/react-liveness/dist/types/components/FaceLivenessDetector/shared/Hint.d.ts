import * as React from 'react';
import { IlluminationState, FaceMatchState } from '../service';
import { HintDisplayText } from '../displayText';
export declare const selectErrorState: import("../hooks").LivenessSelectorFn<"CONNECTION_TIMEOUT" | "TIMEOUT" | "RUNTIME_ERROR" | "FRESHNESS_TIMEOUT" | "SERVER_ERROR" | "CAMERA_FRAMERATE_ERROR" | "CAMERA_ACCESS_ERROR" | "FACE_DISTANCE_ERROR" | "MOBILE_LANDSCAPE_ERROR" | "MULTIPLE_FACES_ERROR" | undefined>;
export declare const selectFaceMatchState: import("../hooks").LivenessSelectorFn<FaceMatchState | undefined>;
export declare const selectIlluminationState: import("../hooks").LivenessSelectorFn<IlluminationState | undefined>;
export declare const selectIsFaceFarEnoughBeforeRecording: import("../hooks").LivenessSelectorFn<boolean | undefined>;
export declare const selectFaceMatchStateBeforeStart: import("../hooks").LivenessSelectorFn<FaceMatchState | undefined>;
export interface HintProps {
    hintDisplayText: Required<HintDisplayText>;
}
export declare const Hint: React.FC<HintProps>;
