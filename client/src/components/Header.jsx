import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import AppleIcon from '@mui/icons-material/Apple';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #000000 30%, #333333 90%)',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const Header = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <LogoBox>
          <AppleIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Apple Certificate Store
          </Typography>
        </LogoBox>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedUserIcon />
          <Typography variant="body1">
            Premium Certificates
          </Typography>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;