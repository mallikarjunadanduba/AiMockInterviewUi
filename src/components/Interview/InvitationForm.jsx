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

import BaseUrl from '../../BaseUrl';

const InvitationForm = () => {
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState('predefined');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("question_mode", mode);
            formData.append("domain", "general"); // Change or dynamically set if needed

            const response = await fetch(`${BaseUrl}/create_session`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'Interview Link Sent',
                    html: `
                    <p>An email with the mock interview link has been sent to <strong>${email}</strong>.</p>
                    <p>Or click below to open it directly.</p>
                    <a href="${data.link}" target="_blank">${data.link}</a>
                `,
                    icon: 'success',
                    confirmButtonText: 'OK',
                });

                setEmail('');
                setMode('predefined');
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.error || 'Something went wrong!',
                    icon: 'error',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message || 'Network error occurred.',
                icon: 'error',
            });
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: {
                    xs: '80%',      // for mobile view
                    sm: '100vh'      // for tablets and above
                },
                py: {
                    xs: 6,           // vertical padding for spacing in mobile
                    sm: 0
                },
                px: 2,
            }}
        >
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
                        fontSize: {
                            xs: '1.2rem', // mobile
                            sm: '2rem',   // tablets
                            md: '2.5rem'  // desktops
                        },
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
                                    fontSize: {
                                        xs: '0.9rem', // mobile
                                        sm: '1rem',   // tablet
                                        md: '1.1rem'  // desktop
                                    },
                                }}
                            >
                                Select Question Mode:
                            </Typography>

                            <ModeToggle mode={mode} setMode={setMode} />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            size="medium"
                            sx={{
                                backgroundColor: 'rgb(0, 175, 181)',
                                fontSize: {
                                    xs: '0.9rem', // mobile
                                    sm: '1rem',   // tablet
                                    md: '1.1rem'  // desktop
                                },
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
