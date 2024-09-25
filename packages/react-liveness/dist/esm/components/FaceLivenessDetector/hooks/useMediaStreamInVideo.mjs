import { useRef, useState, useEffect } from 'react';
import { isObject } from '@aws-amplify/ui';
import { STATIC_VIDEO_CONSTRAINTS } from '../utils/helpers.mjs';

function useMediaStreamInVideo(stream) {
    const height = STATIC_VIDEO_CONSTRAINTS.height.ideal;
    const width = STATIC_VIDEO_CONSTRAINTS.width.ideal;
    const videoRef = useRef(null);
    const [videoHeight, setVideoHeight] = useState(height);
    const [videoWidth, setVideoWidth] = useState(width);
    useEffect(() => {
        if (stream) {
            if (isObject(videoRef.current)) {
                videoRef.current.srcObject = stream;
            }
            const { height: streamHeight, width: streamWidth } = stream
                .getTracks()[0]
                .getSettings();
            setVideoHeight(streamHeight);
            setVideoWidth(streamWidth);
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => {
                    stream.removeTrack(track);
                    track.stop();
                });
            }
        };
    }, [stream]);
    return {
        videoRef,
        videoHeight,
        videoWidth,
    };
}

export { useMediaStreamInVideo };
