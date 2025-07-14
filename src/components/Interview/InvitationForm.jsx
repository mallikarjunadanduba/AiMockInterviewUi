import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Paper,
    Divider
} from '@mui/material';
import Swal from 'sweetalert2';
import ModeToggle from './ModeToggle';
import { Link } from 'react-router-dom';

const InvitationForm = () => {
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState('predefined');

    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Interview Link Sent',
            html: `
        <p>An email with the mock interview link has been sent to <strong>${email}</strong>.</p>
        <p>Please check your inbox and follow the instructions.</p>
      `,
            icon: 'success',
            confirmButtonText: 'OK',
        });

        setEmail('');
        setMode('predefined');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 16, px: 2 }}>
            <Paper
                elevation={4}
                sx={{
                    p: 5,
                    width: '100%',
                    maxWidth: 520,
                    borderRadius: 3,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: 'rgb(0, 175, 181)',
                        fontWeight: 700,
                        mb: 2,
                        textAlign: 'center',
                    }}
                >
                    Mock Interview Invitation
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Enter your email"
                            type="email"
                            required
                            fullWidth
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: '#22223b',
                                    fontWeight: 600,
                                    mb: 1,
                                }}
                            >
                                Select Question Mode:
                            </Typography>
                            <ModeToggle mode={mode} setMode={setMode} />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: 'rgb(0, 175, 181)',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: 'rgb(0, 155, 160)',
                                },
                            }}
                        >
                            Join Mockup Interview
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default InvitationForm;
