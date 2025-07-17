import React from 'react';
import { Typography, Box } from '@mui/material';

const TranscriptResult = ({ response, loading }) => {
  if (loading) {
    return (
      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight="bold">Transcript:</Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>Processing...</Typography>
      </Box>
    );
  }

  if (!response) return null;

  return (
    <Box mt={3}>
      {response.transcript && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">Transcript:</Typography>
          <Typography variant="body1">{response.transcript}</Typography>
        </>
      )}

      {response.resume_summary && (
        <Box mt={2} p={2} sx={{ backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#00695c' }}>
            📄 Resume Summary:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {response.resume_summary}
          </Typography>
        </Box>
      )}
    </Box>
  );
};


export default TranscriptResult;
