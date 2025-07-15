import React from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';

const ReportDetails = ({ report }) => (
  <>
    <Typography variant="h5" gutterBottom>
      Details by Category
    </Typography>

    <Paper elevation={2} sx={{ p: 3 }}>
      <List>
        {Object.entries(report).map(([category, questions]) => (
          <Box key={category} mb={2}>
            <Typography variant="h6" fontWeight="bold">
              {category}
            </Typography>
            <List disablePadding>
              {Object.entries(questions).map(([question, res], index) => (
                <Box key={index} mt={2}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <>
                          <strong>Question:</strong> {question}<br />
                          <strong>Answer:</strong> {res.transcript}<br />
                          <strong>Sentiment:</strong> {res.sentiment} ({res.score.toFixed(2)})<br />
                          <strong>Score:</strong> {res.score.toFixed(2)}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </Box>
              ))}
            </List>
          </Box>
        ))}
      </List>
    </Paper>
  </>
);

export default ReportDetails;
