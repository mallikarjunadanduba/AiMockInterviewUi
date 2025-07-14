import React from 'react';
import { Typography, Box } from '@mui/material';

const TranscriptResult = ({ response }) => {
  if (!response) return null;

  return (
    <Box mt={3}>
      <Typography variant="subtitle1" fontWeight="bold">Transcript:</Typography>
      <Typography variant="body1">{response.transcript}</Typography>
      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        Sentiment: <strong>{response.sentiment}</strong> ({response.score})
      </Typography>
    </Box>
  );
};

export default TranscriptResult;
