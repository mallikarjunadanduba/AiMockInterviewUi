import React from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NavItems = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: '"Segoe UI", sans-serif',
                        fontWeight: 600,
                        fontSize: '20px',
                    }}
                >
                    <span style={{ color: 'rgb(0, 175, 181)' }}>AI</span>{' '}
                    <span style={{ color: 'rgb(34, 34, 59)' }}>Mock Interview</span>
                </Typography>
            </Link>
        </Box>
    );
};

export default NavItems;
