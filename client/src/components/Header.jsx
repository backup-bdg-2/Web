import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import AppleIcon from '@mui/icons-material/Apple';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import { Link } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '200%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #2196F3, transparent)',
    animation: 'glowingBorder 3s linear infinite',
  },
  '@keyframes glowingBorder': {
    '0%': {
      left: '-100%',
    },
    '100%': {
      left: '100%',
    },
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const GlowingIcon = styled(AppleIcon)(({ theme }) => ({
  filter: 'drop-shadow(0 0 5px #2196F3)',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      filter: 'drop-shadow(0 0 2px #2196F3)',
    },
    '50%': {
      filter: 'drop-shadow(0 0 8px #2196F3)',
    },
    '100%': {
      filter: 'drop-shadow(0 0 2px #2196F3)',
    },
  },
}));

const Header = () => {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <StyledAppBar position="sticky" sx={{ 
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.7)' : '0 4px 15px rgba(0, 0, 0, 0.5)',
    }}>
      <Toolbar>
        <LogoBox component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          <GlowingIcon sx={{ fontSize: 32 }} />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 10px rgba(33, 150, 243, 0.3)',
            }}
          >
            Backdoor Certificates
          </Typography>
        </LogoBox>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          background: 'rgba(33, 150, 243, 0.1)',
          borderRadius: '20px',
          padding: '4px 12px',
          boxShadow: 'inset 0 0 5px rgba(33, 150, 243, 0.2)',
        }}>
          <SecurityIcon sx={{ 
            color: theme.palette.primary.main,
            filter: 'drop-shadow(0 0 2px rgba(33, 150, 243, 0.5))',
          }} />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            Premium Certificates
          </Typography>
          <LockIcon sx={{ 
            fontSize: 16, 
            color: theme.palette.primary.main,
            filter: 'drop-shadow(0 0 2px rgba(33, 150, 243, 0.5))',
          }} />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;