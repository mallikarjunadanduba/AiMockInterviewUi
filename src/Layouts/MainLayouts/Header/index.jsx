import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Container,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoSection from './LogoSection';
import NavItems from './NavItems';
import { Link } from 'react-router-dom';
import { Directions } from '@mui/icons-material';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: '#fff',
                    boxShadow: 3,
                    borderRadius: '50px',
                    px: 2,
                    mt: 2,
                    zIndex: (theme) => theme.zIndex + 1,
                    width: '95%',
                    maxWidth: '1450px', // MATCH WIDTH HERE
                    mx: 'auto',
                    left: 0,
                    right: 0,
                }}
            >

                <Container maxWidth="xl">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <LogoSection />

                        {isMobile ? (
                            <IconButton onClick={toggleDrawer} sx={{ color: 'rgb(0, 175, 181)' }}>
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <NavItems />
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Drawer for mobile */}
            <Drawer anchor="right" open={open} onClose={toggleDrawer}>
                <Box
                    sx={{ width: 250, p: 2 }}
                    role="presentation"
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}
                >
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={Link}
                                to="/">
                                <ListItemText
                                    primary={
                                        <span>
                                            <span style={{ color: 'rgb(0, 175, 181)', fontWeight: 600 }}>AI </span>
                                            <span style={{ color: 'rgb(34, 34, 59)', fontWeight: 600 }}>
                                                Mock Interview
                                            </span>
                                        </span>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;
