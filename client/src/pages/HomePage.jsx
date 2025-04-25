import React from 'react';
import { Box, Typography, Container, Button, Paper, Grid, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AppleIcon from '@mui/icons-material/Apple';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #000000 30%, #333333 90%)',
  color: 'white',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
}));

const CertificateCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
  },
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  gap: theme.spacing(1),
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '2rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const HomePage = () => {
  const navigate = useNavigate();

  const handleSelectCertificate = (type) => {
    navigate(`/customize/${type}`);
  };

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <AppleIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Premium Apple Certificates
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Get your custom Apple certificates with enhanced features and protection
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            color="primary"
            onClick={() => document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' })}
            sx={{ 
              borderRadius: 8, 
              px: 4, 
              py: 1.5,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            View Certificates
          </Button>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }} id="certificates">
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
          Choose Your Certificate
        </Typography>

        <Grid container spacing={4}>
          {/* Standard Certificate */}
          <Grid item xs={12} md={6}>
            <CertificateCard elevation={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Standard Certificate
                </Typography>
              </Box>
              
              <Chip 
                label="72 Hour Waiting Period" 
                color="warning" 
                icon={<AccessTimeIcon />} 
                sx={{ alignSelf: 'flex-start', mb: 2 }} 
              />
              
              <PriceTag variant="h4">$6.00</PriceTag>
              
              <Typography variant="body1" sx={{ mb: 3, flex: 1 }}>
                Our standard certificate option with a 72-hour waiting period. Perfect for users who don't need immediate access.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FeatureItem>
                  <ShieldIcon color="primary" />
                  <Typography variant="body2">Revoke Protection</Typography>
                </FeatureItem>
                <FeatureItem>
                  <SettingsIcon color="primary" />
                  <Typography variant="body2">Custom Entitlements</Typography>
                </FeatureItem>
                <FeatureItem>
                  <AppleIcon color="primary" />
                  <Typography variant="body2">Apple Developer Features</Typography>
                </FeatureItem>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                onClick={() => handleSelectCertificate('standard')}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                }}
              >
                Select Standard
              </Button>
            </CertificateCard>
          </Grid>

          {/* Instant Certificate */}
          <Grid item xs={12} md={6}>
            <CertificateCard elevation={3} sx={{ borderTop: '5px solid #2196F3' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FlashOnIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Instant Certificate
                </Typography>
              </Box>
              
              <Chip 
                label="Instant Delivery" 
                color="primary" 
                icon={<SpeedIcon />} 
                sx={{ alignSelf: 'flex-start', mb: 2 }} 
              />
              
              <PriceTag variant="h4">$14.00</PriceTag>
              
              <Typography variant="body1" sx={{ mb: 3, flex: 1 }}>
                Get your certificate instantly without any waiting period. Ideal for users who need immediate access to Apple developer features.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FeatureItem>
                  <ShieldIcon color="primary" />
                  <Typography variant="body2">Enhanced Revoke Protection</Typography>
                </FeatureItem>
                <FeatureItem>
                  <SettingsIcon color="primary" />
                  <Typography variant="body2">Premium Custom Entitlements</Typography>
                </FeatureItem>
                <FeatureItem>
                  <SpeedIcon color="primary" />
                  <Typography variant="body2">Instant Activation</Typography>
                </FeatureItem>
                <FeatureItem>
                  <AppleIcon color="primary" />
                  <Typography variant="body2">Full Apple Developer Features</Typography>
                </FeatureItem>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                onClick={() => handleSelectCertificate('instant')}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                Select Instant
              </Button>
            </CertificateCard>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: '#f5f5f7', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
            Why Choose Our Certificates?
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'transparent' }}>
                <ShieldIcon sx={{ fontSize: 50, color: '#2196F3', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Revoke Protection
                </Typography>
                <Typography variant="body1">
                  Our certificates come with built-in revoke protection to ensure your apps continue to function without interruption.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'transparent' }}>
                <SettingsIcon sx={{ fontSize: 50, color: '#2196F3', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Custom Entitlements
                </Typography>
                <Typography variant="body1">
                  Tailor your certificate with custom entitlements to unlock specific features and capabilities for your development needs.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'transparent' }}>
                <SpeedIcon sx={{ fontSize: 50, color: '#2196F3', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Fast Delivery Options
                </Typography>
                <Typography variant="body1">
                  Choose between standard delivery with a waiting period or instant delivery for immediate access to your certificate.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;