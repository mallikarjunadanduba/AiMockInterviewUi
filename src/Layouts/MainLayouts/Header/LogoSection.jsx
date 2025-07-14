import React from 'react';
import { Box } from '@mui/material';
import Logo from '../../../assets/images/logo/KWLogo.png';

const LogoSection = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img src={Logo} alt="KW Logo" style={{ height: '50px' }} />
    </Box>
  );
};

export default LogoSection;
