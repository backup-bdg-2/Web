import React from 'react';
import { Box, Typography, Link, Container, Grid, Button, Divider, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentIcon from '@mui/icons-material/Payment';
import AppleIcon from '@mui/icons-material/Apple';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Animations
const pulse = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(33, 150, 243, 0.5)); }
  50% { filter: drop-shadow(0 0 8px rgba(33, 150, 243, 0.8)); }
  100% { filter: drop-shadow(0 0 2px rgba(33, 150, 243, 0.5)); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #121212 0%, #1e3a5f 100%)',
  color: 'white',
  padding: theme.spacing(6, 0, 4),
  marginTop: 'auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.5), transparent)',
    zIndex: 1,
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    transform: 'translateX(5px)',
  },
}));

const GlowingIcon = styled(Box)(({ theme }) => ({
  animation: `${pulse} 3s infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ShimmerLink = styled(Link)(({ theme }) => ({
  color: '#2196F3',
  textDecoration: 'none',
  position: 'relative',
  display: 'inline-block',
  padding: '0 2px',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#64B5F6',
    textDecoration: 'none',
    '&::after': {
      opacity: 1,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #2196F3, transparent)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 2s infinite`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
}));

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GlowingIcon>
                  <AppleIcon sx={{ fontSize: 28, color: '#2196F3', mr: 1 }} />
                </GlowingIcon>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Backdoor Certificates
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, maxWidth: '300px' }}>
                Premium Apple certificates with custom entitlements, revoke protection, and flexible validity options.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                href="#certificates"
                sx={{ 
                  borderRadius: '20px',
                  borderColor: 'rgba(33, 150, 243, 0.5)',
                  '&:hover': {
                    borderColor: '#2196F3',
                    background: 'rgba(33, 150, 243, 0.08)',
                  }
                }}
              >
                View Certificates
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: '#ffffff',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-5px',
                  left: 0,
                  width: '40px',
                  height: '2px',
                  background: '#2196F3',
                },
              }}
            >
              Features
            </Typography>
            
            <FooterSection>
              <ShieldIcon sx={{ color: '#2196F3' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Revoke Protection
              </Typography>
            </FooterSection>
            
            <FooterSection>
              <SettingsIcon sx={{ color: '#2196F3' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Custom Entitlements
              </Typography>
            </FooterSection>
            
            <FooterSection>
              <CalendarMonthIcon sx={{ color: '#2196F3' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Flexible Validity Options
              </Typography>
            </FooterSection>
            
            <FooterSection>
              <VerifiedUserIcon sx={{ color: '#2196F3' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Premium Support
              </Typography>
            </FooterSection>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: '#ffffff',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-5px',
                  left: 0,
                  width: '40px',
                  height: '2px',
                  background: '#2196F3',
                },
              }}
            >
              Contact Us
            </Typography>
            
            <FooterSection>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
              }}>
                <img 
                  src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" 
                  alt="Discord" 
                  style={{ width: 20, height: 20 }} 
                />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Discord: <ShimmerLink href="https://discord.com" target="_blank" rel="noopener">@xbl_bdg</ShimmerLink>
                </Typography>
              </Box>
            </FooterSection>
            
            <FooterSection>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
              }}>
                <img 
                  src="https://telegram.org/img/t_logo.svg" 
                  alt="Telegram" 
                  style={{ width: 20, height: 20 }} 
                />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Telegram: <ShimmerLink href="https://telegram.org" target="_blank" rel="noopener">@elchops</ShimmerLink>
                </Typography>
              </Box>
            </FooterSection>
            
            <Box sx={{ mt: 3 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                Our Guarantees
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '4px 10px',
                  borderRadius: '15px',
                }}>
                  <SecurityIcon sx={{ fontSize: 16, color: '#2196F3' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Secure Transactions
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '4px 10px',
                  borderRadius: '15px',
                }}>
                  <SupportAgentIcon sx={{ fontSize: 16, color: '#2196F3' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    24/7 Support
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '4px 10px',
                  borderRadius: '15px',
                }}>
                  <PaymentIcon sx={{ fontSize: 16, color: '#2196F3' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Secure Payment
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ 
          my: 4, 
          borderColor: 'rgba(255, 255, 255, 0.1)',
          '&::before, &::after': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }
        }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            © {currentYear} Backdoor Certificates. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255, 255, 255, 0.4)' }}>
            "Lifetime" means as long as our service continues to operate.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;