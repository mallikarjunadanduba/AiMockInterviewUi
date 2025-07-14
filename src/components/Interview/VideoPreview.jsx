import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const  VideoPreview = ({ stream }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <Box mt={2}>
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    objectFit: 'cover',
                }}
            />
        </Box>
    );
};

export default VideoPreview;
