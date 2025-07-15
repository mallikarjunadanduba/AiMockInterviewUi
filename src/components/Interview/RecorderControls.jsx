import React, { useRef, useState, useEffect } from 'react';
import { Button, Stack, Typography } from '@mui/material';

const RecorderControls = ({ stream, sessionId, questionData, onNext, setResponse }) => {
  const recorderRef = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Start the timer
  const startTimer = () => {
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Stop the timer
  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const startRecording = () => {
    chunks.current = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    recorder.onstop = async () => {
      stopTimer();
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('category', questionData.category);
      formData.append('question', questionData.text);
      formData.append('video', blob);

      const res = await fetch('/upload_response', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
      onNext();
    };

    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    startTimer();
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {!isRecording ? (
        <Button onClick={startRecording} variant="contained" color="success">
          🎥 Start Recording
        </Button>
      ) : (
        <>
          <Button onClick={stopRecording} variant="contained" color="error">
            ⏹ Stop Recording
          </Button>
          <Typography variant="body1" color="text.secondary">
            ⏱ {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
          </Typography>
        </>
      )}
    </Stack>
  );
};

export default RecorderControls;
