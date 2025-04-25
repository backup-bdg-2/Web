import React, { useEffect, useRef } from 'react';
import { Box, Typography, Container, Button, Paper, Grid, Chip, Divider, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AppleIcon from '@mui/icons-material/Apple';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(33, 150, 243, 0); }
  100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(33, 150, 243, 0.5)); }
  50% { filter: drop-shadow(0 0 8px rgba(33, 150, 243, 0.8)); }
  100% { filter: drop-shadow(0 0 2px rgba(33, 150, 243, 0.5)); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #121212 0%, #1e3a5f 100%)',
  color: 'white',
  padding: theme.spacing(12, 0, 10),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(33, 150, 243, 0.15), transparent 70%)',
    zIndex: 0,
  },
  '&::after': {
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

const FloatingIcon = styled(Box)(({ theme }) => ({
  animation: `${float} 6s ease-in-out infinite`,
  filter: 'drop-shadow(0 0 10px rgba(33, 150, 243, 0.7))',
}));

const CertificateCard = styled(Paper)(({ theme, premium }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  background: premium 
    ? 'linear-gradient(135deg, #0d253f 0%, #1a3b5f 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%)',
  color: premium ? '#ffffff' : 'inherit',
  border: premium ? '1px solid rgba(33, 150, 243, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: premium 
      ? '0 15px 30px rgba(33, 150, 243, 0.3), 0 0 10px rgba(33, 150, 243, 0.2)' 
      : '0 15px 30px rgba(0, 0, 0, 0.15)',
  },
  '&::before': premium ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #2196F3, transparent)',
    zIndex: 1,
  } : {},
}));

const FeatureItem = styled(Box)(({ theme, premium }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  gap: theme.spacing(1.5),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  background: premium ? 'rgba(255, 255, 255, 0.05)' : 'rgba(33, 150, 243, 0.05)',
  transition: 'transform 0.2s ease, background 0.2s ease',
  '&:hover': {
    transform: 'translateX(5px)',
    background: premium ? 'rgba(255, 255, 255, 0.1)' : 'rgba(33, 150, 243, 0.1)',
  },
}));

const PriceTag = styled(Typography)(({ theme, premium }) => ({
  fontWeight: 'bold',
  fontSize: '2.5rem',
  marginBottom: theme.spacing(2),
  color: premium ? '#2196F3' : theme.palette.primary.main,
  textShadow: premium ? '0 0 10px rgba(33, 150, 243, 0.5)' : 'none',
  display: 'inline-block',
  position: 'relative',
}));

const GlowingIcon = styled(Box)(({ theme }) => ({
  animation: `${glow} 2s infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PulseButton = styled(Button)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transform: 'rotate(30deg)',
    animation: `${shimmer} 3s linear infinite`,
    backgroundSize: '200% 100%',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  border: '1px solid rgba(33, 150, 243, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const featuresRef = useRef(null);

  const handleSelectCertificate = (type) => {
    navigate(`/customize/${type}`);
  };

  useEffect(() => {
    // Add scroll reveal animation for elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <FloatingIcon>
            <AppleIcon sx={{ fontSize: 70, mb: 2, color: '#2196F3' }} />
          </FloatingIcon>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              textShadow: '0 0 15px rgba(33, 150, 243, 0.5)',
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Backdoor Certificates
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              maxWidth: '800px',
              margin: '0 auto 2rem',
              lineHeight: 1.6,
            }}
          >
            Unlock the full potential of your Apple devices with our premium certificates.
            Enhanced features, custom entitlements, and robust protection.
          </Typography>
          <PulseButton 
            variant="contained" 
            size="large" 
            color="primary"
            onClick={() => document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' })}
            sx={{ 
              borderRadius: 8, 
              px: 4, 
              py: 1.8,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 5px 15px rgba(33, 203, 243, .4)',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            View Certificates
          </PulseButton>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 6,
            gap: 4,
            flexWrap: 'wrap',
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)',
              padding: '8px 16px',
              borderRadius: '30px',
            }}>
              <VerifiedIcon sx={{ color: '#2196F3' }} />
              <Typography variant="body2">Verified Certificates</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)',
              padding: '8px 16px',
              borderRadius: '30px',
            }}>
              <ShieldIcon sx={{ color: '#2196F3' }} />
              <Typography variant="body2">Revoke Protection</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)',
              padding: '8px 16px',
              borderRadius: '30px',
            }}>
              <SupportAgentIcon sx={{ color: '#2196F3' }} />
              <Typography variant="body2">24/7 Support</Typography>
            </Box>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 10 }} id="certificates">
        <Box className="reveal" sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '3px',
                background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                borderRadius: '3px',
              }
            }}
          >
            Choose Your Certificate
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', mt: 3, color: 'text.secondary' }}>
            Select the certificate that best fits your needs. Each certificate comes with different features and delivery times.
            <Box component="span" sx={{ display: 'block', mt: 1, fontStyle: 'italic', fontSize: '0.9rem' }}>
              <InfoIcon sx={{ fontSize: '0.9rem', verticalAlign: 'middle', mr: 0.5 }} />
              "Lifetime" means as long as our service continues to operate.
            </Box>
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Standard Certificate */}
          <Grid item xs={12} md={6} className="reveal">
            <CertificateCard elevation={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccessTimeIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Standard Certificate
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Chip 
                  label="72 Hour Delivery" 
                  color="warning" 
                  icon={<AccessTimeIcon />} 
                  sx={{ borderRadius: '20px' }} 
                />
                <Chip 
                  label="1 Year Validity" 
                  color="info" 
                  icon={<CalendarMonthIcon />} 
                  sx={{ borderRadius: '20px' }} 
                />
              </Box>
              
              <PriceTag variant="h4">$6.00</PriceTag>
              
              <Typography variant="body1" sx={{ mb: 3, flex: 1 }}>
                Our standard certificate option with a 72-hour waiting period. Perfect for users who don't need immediate access.
                Valid for one full year from activation.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Features Included:
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FeatureItem>
                  <ShieldIcon color="primary" />
                  <Typography variant="body2">Basic Revoke Protection</Typography>
                </FeatureItem>
                <FeatureItem>
                  <SettingsIcon color="primary" />
                  <Typography variant="body2">Standard Entitlements</Typography>
                </FeatureItem>
                <FeatureItem>
                  <AppleIcon color="primary" />
                  <Typography variant="body2">Apple Developer Features</Typography>
                </FeatureItem>
                <FeatureItem>
                  <CalendarMonthIcon color="primary" />
                  <Typography variant="body2">1 Year Validity Period</Typography>
                </FeatureItem>
              </Box>
              
              <PulseButton 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                onClick={() => handleSelectCertificate('standard')}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  mt: 'auto',
                }}
              >
                Select Standard
              </PulseButton>
            </CertificateCard>
          </Grid>

          {/* Instant Certificate */}
          <Grid item xs={12} md={6} className="reveal">
            <CertificateCard elevation={4} premium>
              <Box sx={{ 
                position: 'absolute', 
                top: 15, 
                right: 15, 
                background: 'linear-gradient(45deg, #ff9800, #f44336)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}>
                <StarIcon sx={{ fontSize: '0.875rem' }} />
                PREMIUM
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <GlowingIcon>
                  <FlashOnIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                </GlowingIcon>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                  Instant Certificate
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Chip 
                  label="Instant Delivery" 
                  color="primary" 
                  icon={<SpeedIcon />} 
                  sx={{ borderRadius: '20px', background: 'rgba(33, 150, 243, 0.8)' }} 
                />
                <Chip 
                  label="Lifetime Validity" 
                  color="success" 
                  icon={<VerifiedIcon />} 
                  sx={{ borderRadius: '20px' }} 
                />
              </Box>
              
              <PriceTag variant="h4" premium>$14.00</PriceTag>
              
              <Typography variant="body1" sx={{ mb: 3, flex: 1, color: 'rgba(255, 255, 255, 0.9)' }}>
                Get your certificate instantly without any waiting period. Ideal for users who need immediate access to Apple developer features.
                Lifetime validity for as long as our service operates.
              </Typography>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#ffffff' }}>
                Premium Features:
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FeatureItem premium>
                  <ShieldIcon sx={{ color: '#2196F3' }} />
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>Enhanced Revoke Protection</Typography>
                </FeatureItem>
                <FeatureItem premium>
                  <SettingsIcon sx={{ color: '#2196F3' }} />
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>Premium Custom Entitlements</Typography>
                </FeatureItem>
                <FeatureItem premium>
                  <SpeedIcon sx={{ color: '#2196F3' }} />
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>Instant Activation</Typography>
                </FeatureItem>
                <FeatureItem premium>
                  <VerifiedIcon sx={{ color: '#2196F3' }} />
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>Lifetime Validity</Typography>
                </FeatureItem>
                <FeatureItem premium>
                  <SupportAgentIcon sx={{ color: '#2196F3' }} />
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>Priority Support</Typography>
                </FeatureItem>
              </Box>
              
              <PulseButton 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                onClick={() => handleSelectCertificate('instant')}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  mt: 'auto',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 5px 15px rgba(33, 203, 243, .4)',
                }}
              >
                Select Instant
              </PulseButton>
            </CertificateCard>
          </Grid>
        </Grid>
      </Container>

      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #f5f5f7 0%, #e8eaf6 100%)',
          py: 10,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.3), transparent)',
          },
        }}
        ref={featuresRef}
      >
        <Container maxWidth="lg">
          <Box className="reveal" sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                  borderRadius: '3px',
                }
              }}
            >
              Why Choose Our Certificates?
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', mt: 3, color: 'text.secondary' }}>
              Our certificates offer premium features and robust protection to ensure your development experience is seamless and secure.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} className="reveal">
              <FeatureCard elevation={0}>
                <GlowingIcon sx={{ mb: 2 }}>
                  <ShieldIcon sx={{ fontSize: 50, color: '#2196F3' }} />
                </GlowingIcon>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Revoke Protection
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our certificates come with built-in revoke protection to ensure your apps continue to function without interruption, even if Apple attempts to revoke standard certificates.
                </Typography>
              </FeatureCard>
            </Grid>
            
            <Grid item xs={12} md={4} className="reveal">
              <FeatureCard elevation={0}>
                <GlowingIcon sx={{ mb: 2 }}>
                  <SettingsIcon sx={{ fontSize: 50, color: '#2196F3' }} />
                </GlowingIcon>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Custom Entitlements
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tailor your certificate with custom entitlements to unlock specific features and capabilities for your development needs. Add advanced functionality to your apps with ease.
                </Typography>
              </FeatureCard>
            </Grid>
            
            <Grid item xs={12} md={4} className="reveal">
              <FeatureCard elevation={0}>
                <GlowingIcon sx={{ mb: 2 }}>
                  <SpeedIcon sx={{ fontSize: 50, color: '#2196F3' }} />
                </GlowingIcon>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Flexible Delivery Options
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Choose between standard delivery with a 72-hour waiting period or instant delivery for immediate access to your certificate. Select the option that best fits your timeline and budget.
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;