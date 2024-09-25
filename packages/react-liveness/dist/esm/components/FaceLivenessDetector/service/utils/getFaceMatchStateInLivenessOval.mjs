import { FaceMatchState } from '../types/liveness.mjs';
import { generateBboxFromLandmarks, getOvalBoundingBox, getIntersectionOverUnion } from './liveness.mjs';
import { FACE_MATCH_RANGE_MAX, FACE_MATCH_WEIGHT_MAX, FACE_MATCH_WEIGHT_MIN, FACE_MATCH_RANGE_MIN } from './constants.mjs';

/**
 * Returns the state of the provided face with respect to the provided liveness oval.
 */
function getFaceMatchStateInLivenessOval({ face, ovalDetails, initialFaceIntersection, sessionInformation, frameHeight, }) {
    let faceMatchState;
    const challengeConfig = sessionInformation?.Challenge?.FaceMovementAndLightChallenge
        ?.ChallengeConfig;
    if (!challengeConfig ||
        !challengeConfig.OvalIouThreshold ||
        !challengeConfig.OvalIouHeightThreshold ||
        !challengeConfig.OvalIouWidthThreshold ||
        !challengeConfig.FaceIouHeightThreshold ||
        !challengeConfig.FaceIouWidthThreshold) {
        throw new Error('Challenge information not returned from session information.');
    }
    const { OvalIouThreshold, FaceIouHeightThreshold, FaceIouWidthThreshold } = challengeConfig;
    const faceBoundingBox = generateBboxFromLandmarks(face, ovalDetails, frameHeight);
    const minFaceX = faceBoundingBox.left;
    const maxFaceX = faceBoundingBox.right;
    const minFaceY = faceBoundingBox.top;
    const maxFaceY = faceBoundingBox.bottom;
    const { ovalBoundingBox, minOvalX, minOvalY, maxOvalX, maxOvalY } = getOvalBoundingBox(ovalDetails);
    const intersection = getIntersectionOverUnion(faceBoundingBox, ovalBoundingBox);
    const intersectionThreshold = OvalIouThreshold;
    const faceDetectionWidthThreshold = ovalDetails.width * FaceIouWidthThreshold;
    const faceDetectionHeightThreshold = ovalDetails.height * FaceIouHeightThreshold;
    /** From Science
     * p=max(min(1,0.75∗(si−s0)/(st−s0)+0.25)),0)
     */
    const faceMatchPercentage = Math.max(Math.min(FACE_MATCH_RANGE_MAX, (FACE_MATCH_WEIGHT_MAX * (intersection - initialFaceIntersection)) /
        (intersectionThreshold - initialFaceIntersection) +
        FACE_MATCH_WEIGHT_MIN), FACE_MATCH_RANGE_MIN) * 100;
    const isFaceOutsideOvalToTheLeft = minOvalX > minFaceX && maxOvalX > maxFaceX;
    const isFaceOutsideOvalToTheRight = minFaceX > minOvalX && maxFaceX > maxOvalX;
    const isFaceMatched = intersection > intersectionThreshold;
    const isFaceMatchedClosely = minOvalY - minFaceY > faceDetectionHeightThreshold ||
        maxFaceY - maxOvalY > faceDetectionHeightThreshold ||
        (minOvalX - minFaceX > faceDetectionWidthThreshold &&
            maxFaceX - maxOvalX > faceDetectionWidthThreshold);
    if (isFaceMatched) {
        faceMatchState = FaceMatchState.MATCHED;
    }
    else if (isFaceOutsideOvalToTheLeft || isFaceOutsideOvalToTheRight) {
        faceMatchState = FaceMatchState.OFF_CENTER;
    }
    else if (isFaceMatchedClosely) {
        faceMatchState = FaceMatchState.MATCHED;
    }
    else {
        faceMatchState = FaceMatchState.TOO_FAR;
    }
    return { faceMatchState, faceMatchPercentage };
}

export { getFaceMatchStateInLivenessOval };
