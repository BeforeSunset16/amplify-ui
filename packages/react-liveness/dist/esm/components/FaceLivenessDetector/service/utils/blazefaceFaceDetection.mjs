import { ready, setBackend } from '@tensorflow/tfjs-core';
import { createDetector, SupportedModels } from '@tensorflow-models/face-detection';
import { setWasmPaths, version_wasm } from '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-cpu';
import { jitteredExponentialRetry } from '@aws-amplify/core/internals/utils';
import { isWebAssemblySupported } from './support.mjs';
import { FaceDetection } from '../types/faceDetection.mjs';
import '../types/liveness.mjs';

const BLAZEFACE_VERSION = '1.0.2';
/**
 *   WARNING: When updating these links,
 *   also make sure to update documentation and the link in the canary/e2e test "canary/e2e/features/liveness/face-detect.feature"
 */
const DEFAULT_BLAZEFACE_URL = `https://cdn.liveness.rekognition.amazonaws.com/face-detection/tensorflow-models/blazeface/${BLAZEFACE_VERSION}/model/model.json`;
const DEFAULT_TFJS_WASM_URL = `https://cdn.liveness.rekognition.amazonaws.com/face-detection/tensorflow/tfjs-backend-wasm/${version_wasm}/`;
/**
 * The BlazeFace implementation of the FaceDetection interface.
 */
class BlazeFaceFaceDetection extends FaceDetection {
    constructor(binaryPath, faceModelUrl) {
        super();
        this.faceModelUrl = faceModelUrl ?? DEFAULT_BLAZEFACE_URL;
        this.binaryPath = binaryPath ?? DEFAULT_TFJS_WASM_URL;
    }
    async loadModels() {
        if (isWebAssemblySupported()) {
            await this._loadWebAssemblyBackend();
        }
        else {
            await this._loadCPUBackend();
        }
        try {
            await ready();
            this._model = await createDetector(SupportedModels.MediaPipeFaceDetector, {
                runtime: 'tfjs',
                detectorModelUrl: this.faceModelUrl,
            });
        }
        catch (e) {
            throw new Error('There was an error loading the blazeface model. If you are using a custom blazeface model url ensure that it is a fully qualified url that returns a json file.');
        }
    }
    async detectFaces(videoEl) {
        const flipHorizontal = true;
        const predictions = await this._model.estimateFaces(videoEl, {
            flipHorizontal,
        });
        const timestampMs = Date.now();
        const faces = predictions.map((prediction) => {
            const { box, keypoints } = prediction;
            const { xMin: left, yMin: top, width, height } = box;
            const rightEye = this._getCoordinate(keypoints, 'rightEye');
            const leftEye = this._getCoordinate(keypoints, 'leftEye');
            const nose = this._getCoordinate(keypoints, 'noseTip');
            const mouth = this._getCoordinate(keypoints, 'mouthCenter');
            const rightEar = this._getCoordinate(keypoints, 'rightEarTragion');
            const leftEar = this._getCoordinate(keypoints, 'leftEarTragion');
            const probability = [90];
            return {
                top,
                left,
                width,
                height,
                timestampMs,
                probability: probability[0],
                rightEye,
                leftEye,
                mouth,
                nose,
                rightEar,
                leftEar,
            };
        });
        return faces;
    }
    _getCoordinate(keypoints, name) {
        const keypoint = keypoints.find((k) => k.name === name);
        return [keypoint.x, keypoint.y];
    }
    async _loadWebAssemblyBackend() {
        try {
            setWasmPaths(this.binaryPath);
            await jitteredExponentialRetry(async () => {
                const success = await setBackend('wasm');
                if (!success) {
                    throw new Error(`Initialization of backend wasm failed`);
                }
            }, []);
            this.modelBackend = 'wasm';
        }
        catch (e) {
            throw new Error('There was an error loading the TFJS WASM backend. If you are using a custom WASM path ensure that it ends with "/" and that it is not the full URL as @tensorflow/tfjs-backend-wasm will append the wasm binary file name. Read more: https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/src/backend_wasm.ts#L475.');
        }
    }
    async _loadCPUBackend() {
        await setBackend('cpu');
        this.modelBackend = 'cpu';
    }
}

export { BLAZEFACE_VERSION, BlazeFaceFaceDetection, DEFAULT_BLAZEFACE_URL, DEFAULT_TFJS_WASM_URL };
