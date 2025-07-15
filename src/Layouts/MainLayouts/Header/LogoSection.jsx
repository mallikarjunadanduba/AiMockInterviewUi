import React from 'react';
import { Box } from '@mui/material';
import Logo from '../../../assets/images/logo/KWLogo.png';

const LogoSection = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <img src={Logo} alt="KW Logo" style={{ height: '40px' }} />
    </Box>
  );
};

export default LogoSection;
