import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  FormControlLabel, 
  Checkbox, 
  FormGroup,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
  useTheme,
  Badge
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ShieldIcon from '@mui/icons-material/Shield';
import AppleIcon from '@mui/icons-material/Apple';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InfoIcon from '@mui/icons-material/Info';

// Animations
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

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const CustomizationPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.5), transparent)',
  },
}));

const OptionItem = styled(Box)(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2.5),
  borderRadius: '12px',
  border: selected 
    ? `1px solid ${theme.palette.primary.main}` 
    : `1px solid ${theme.palette.divider}`,
  background: selected 
    ? 'rgba(33, 150, 243, 0.05)' 
    : 'transparent',
  boxShadow: selected 
    ? '0 4px 12px rgba(33, 150, 243, 0.1)' 
    : 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: selected 
      ? 'rgba(33, 150, 243, 0.08)' 
      : theme.palette.action.hover,
    transform: 'translateY(-3px)',
    boxShadow: selected 
      ? '0 6px 15px rgba(33, 150, 243, 0.15)' 
      : '0 4px 10px rgba(0, 0, 0, 0.05)',
  },
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
  color: 'white',
  boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
  '& .MuiChip-icon': {
    color: 'white',
  },
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

const FloatingBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    animation: `${float} 3s ease-in-out infinite`,
    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
  },
}));

const steps = ['Select Certificate', 'Customize Options', 'Review & Confirm'];

// Option pricing
const OPTION_PRICES = {
  revokeProtection: 0, // Included by default
  customEntitlements: 2.00,
  extendedValidity: 2.00,
  prioritySupport: 2.00,
};

const CustomizePage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(1); // Start at step 1 since step 0 was completed on the home page
  const [selectedOptions, setSelectedOptions] = useState({
    revokeProtection: true,
    customEntitlements: false,
    extendedValidity: false,
    prioritySupport: false,
  });
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const certificateDetails = {
    standard: {
      name: 'Standard Certificate',
      basePrice: 6.00,
      waitingPeriod: '72 hours',
      validity: '1 Year',
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
    },
    instant: {
      name: 'Instant Certificate',
      basePrice: 14.00,
      waitingPeriod: 'Instant',
      validity: 'Lifetime',
      icon: <FlashOnIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
    }
  };

  const currentCertificate = certificateDetails[type] || certificateDetails.standard;

  // Calculate total price whenever options change
  useEffect(() => {
    let price = currentCertificate.basePrice;
    
    // Add price for each selected option
    Object.entries(selectedOptions).forEach(([option, isSelected]) => {
      if (isSelected && OPTION_PRICES[option] > 0) {
        price += OPTION_PRICES[option];
      }
    });
    
    setTotalPrice(price);
  }, [selectedOptions, currentCertificate.basePrice]);

  const handleOptionChange = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [option]: !selectedOptions[option]
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 1) {
      navigate('/');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleProceedToPayment = () => {
    navigate('/payment', { 
      state: { 
        certificateType: type, 
        options: selectedOptions,
        price: totalPrice,
        name: currentCertificate.name,
        waitingPeriod: currentCertificate.waitingPeriod,
        validity: currentCertificate.validity
      } 
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <CustomizationPaper elevation={3}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              pb: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            }}>
              <GlowingIcon>
                {currentCertificate.icon}
              </GlowingIcon>
              <Box sx={{ ml: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {currentCertificate.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip 
                    size="small"
                    label={currentCertificate.waitingPeriod} 
                    color={type === 'instant' ? "primary" : "warning"} 
                    icon={type === 'instant' ? <FlashOnIcon /> : <AccessTimeIcon />} 
                  />
                  <Chip 
                    size="small"
                    label={currentCertificate.validity} 
                    color={type === 'instant' ? "success" : "info"} 
                    icon={type === 'instant' ? <VerifiedIcon /> : <CalendarMonthIcon />} 
                  />
                </Box>
              </Box>
            </Box>
            
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4,
                borderRadius: '10px',
                '& .MuiAlert-icon': {
                  color: theme.palette.primary.main,
                },
              }}
              icon={<InfoIcon />}
            >
              {type === 'instant' 
                ? 'You selected the Instant Certificate with lifetime validity. Your certificate will be delivered immediately after payment.'
                : 'You selected the Standard Certificate valid for 1 year. Your certificate will be delivered within 72 hours after payment.'}
              <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                Note: "Lifetime" means as long as our service continues to operate.
              </Typography>
            </Alert>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle', color: theme.palette.primary.main }} />
                Customize Your Certificate
              </Typography>
              
              <FloatingBadge 
                badgeContent={`$${totalPrice.toFixed(2)}`} 
                color="primary"
                overlap="circular"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{ mr: 1 }}
              >
                <Chip 
                  label="Total Price" 
                  color="default" 
                  icon={<AttachMoneyIcon />} 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'rgba(33, 150, 243, 0.1)',
                  }} 
                />
              </FloatingBadge>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enhance your certificate with these additional options. Each customization adds $2.00 to the base price.
            </Typography>
            
            <FormGroup>
              <OptionItem selected={selectedOptions.revokeProtection}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={selectedOptions.revokeProtection} 
                      onChange={() => handleOptionChange('revokeProtection')}
                      color="primary"
                      disabled={true} // Always included
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        <ShieldIcon sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle', color: theme.palette.primary.main }} />
                        Revoke Protection
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ensures your certificate remains valid even if Apple attempts to revoke it.
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%' }}
                />
                <Tooltip title="Included with all certificates">
                  <Chip 
                    label="Included" 
                    size="small" 
                    color="success" 
                    sx={{ ml: 'auto', minWidth: '80px' }} 
                  />
                </Tooltip>
              </OptionItem>
              
              <OptionItem selected={selectedOptions.customEntitlements}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={selectedOptions.customEntitlements} 
                      onChange={() => handleOptionChange('customEntitlements')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        <SettingsIcon sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle', color: theme.palette.primary.main }} />
                        Custom Entitlements
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add specific entitlements to your certificate for advanced functionality and deeper system access.
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%' }}
                />
                <PriceChip 
                  label="$2.00" 
                  size="small" 
                  icon={<AddCircleIcon />} 
                />
              </OptionItem>
              
              <OptionItem selected={selectedOptions.extendedValidity}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={selectedOptions.extendedValidity} 
                      onChange={() => handleOptionChange('extendedValidity')}
                      color="primary"
                      disabled={type === 'instant'} // Already lifetime for instant
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        <CalendarMonthIcon sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle', color: theme.palette.primary.main }} />
                        Extended Revoke Protection
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {type === 'instant' 
                          ? 'Already included with Instant Certificate (Lifetime validity).' 
                          : 'Extends the revoke protection capabilities of your certificate for better long-term reliability.'}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%' }}
                />
                {type === 'instant' ? (
                  <Tooltip title="Already included with Instant Certificate">
                    <Chip 
                      label="Included" 
                      size="small" 
                      color="success" 
                      sx={{ ml: 'auto', minWidth: '80px' }} 
                    />
                  </Tooltip>
                ) : (
                  <PriceChip 
                    label="$2.00" 
                    size="small" 
                    icon={<AddCircleIcon />} 
                  />
                )}
              </OptionItem>
              
              <OptionItem selected={selectedOptions.prioritySupport}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={selectedOptions.prioritySupport} 
                      onChange={() => handleOptionChange('prioritySupport')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        <SupportAgentIcon sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle', color: theme.palette.primary.main }} />
                        Priority Support
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get priority assistance for any issues with your certificate. Includes faster response times and dedicated support.
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%' }}
                />
                <PriceChip 
                  label="$2.00" 
                  size="small" 
                  icon={<AddCircleIcon />} 
                />
              </OptionItem>
            </FormGroup>
            
            <Box sx={{ 
              mt: 4, 
              p: 2, 
              borderRadius: '10px', 
              background: 'rgba(33, 150, 243, 0.05)',
              border: '1px solid rgba(33, 150, 243, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Current Total:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </CustomizationPaper>
        );
      case 2:
        return (
          <CustomizationPaper elevation={3}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 'bold',
              pb: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            }}>
              Review Your Selection
            </Typography>
            
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: '12px', 
              background: type === 'instant' 
                ? 'linear-gradient(135deg, rgba(13, 37, 63, 0.9) 0%, rgba(26, 59, 95, 0.9) 100%)' 
                : 'linear-gradient(135deg, #f5f5f7 0%, #e8eaf6 100%)',
              color: type === 'instant' ? 'white' : 'inherit',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.7), transparent)',
              }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GlowingIcon>
                  {currentCertificate.icon}
                </GlowingIcon>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                  {currentCertificate.name}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={currentCertificate.waitingPeriod} 
                  size="small"
                  color={type === 'instant' ? "primary" : "warning"} 
                  icon={type === 'instant' ? <FlashOnIcon /> : <AccessTimeIcon />} 
                  sx={{ 
                    background: type === 'instant' ? 'rgba(33, 150, 243, 0.8)' : undefined,
                  }}
                />
                <Chip 
                  label={currentCertificate.validity} 
                  size="small"
                  color={type === 'instant' ? "success" : "info"} 
                  icon={type === 'instant' ? <VerifiedIcon /> : <CalendarMonthIcon />} 
                />
              </Box>
              
              <Typography variant="body1" sx={{ 
                color: type === 'instant' ? 'rgba(255, 255, 255, 0.9)' : 'text.secondary',
                mb: 2,
              }}>
                <strong>Base Price:</strong> ${currentCertificate.basePrice.toFixed(2)}
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: type === 'instant' ? 'rgba(255, 255, 255, 0.9)' : 'text.secondary',
              }}>
                <strong>Delivery:</strong> {currentCertificate.waitingPeriod}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
              Selected Options
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              {Object.entries(selectedOptions).map(([option, isSelected]) => (
                isSelected && (
                  <Box 
                    key={option} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2,
                      p: 1.5,
                      borderRadius: '8px',
                      background: 'rgba(33, 150, 243, 0.05)',
                      border: '1px solid rgba(33, 150, 243, 0.1)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1.5 }} />
                      <Typography variant="body1">
                        {option === 'revokeProtection' && 'Revoke Protection'}
                        {option === 'customEntitlements' && 'Custom Entitlements'}
                        {option === 'extendedValidity' && 'Extended Revoke Protection'}
                        {option === 'prioritySupport' && 'Priority Support'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {option === 'revokeProtection' || (option === 'extendedValidity' && type === 'instant')
                        ? 'Included'
                        : `+$${OPTION_PRICES[option].toFixed(2)}`}
                    </Typography>
                  </Box>
                )
              ))}
              
              {!Object.values(selectedOptions).some(value => value) && (
                <Typography variant="body1" color="text.secondary">
                  No additional options selected.
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 2,
              borderRadius: '10px',
              background: 'rgba(33, 150, 243, 0.08)',
              border: '1px solid rgba(33, 150, 243, 0.2)',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
            
            <Alert 
              severity="info" 
              sx={{ 
                mt: 3,
                borderRadius: '10px',
                '& .MuiAlert-icon': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              After payment, {type === 'instant' 
                ? 'you will receive your certificate immediately.' 
                : 'your certificate will be delivered within 72 hours.'}
            </Alert>
          </CustomizationPaper>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(33, 150, 243, 0.1)',
        }}
      >
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{
            '& .MuiStepLabel-root .Mui-completed': {
              color: theme.palette.primary.main,
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: theme.palette.primary.main,
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      {renderStepContent(activeStep)}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={handleBack}
          variant="outlined"
          sx={{ 
            borderRadius: '10px',
            px: 3,
            py: 1,
          }}
        >
          {activeStep === 1 ? 'Back to Home' : 'Back'}
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <PulseButton
            variant="contained"
            color="primary"
            onClick={handleProceedToPayment}
            disabled={loading}
            sx={{ 
              minWidth: 200,
              borderRadius: '10px',
              py: 1.5,
              px: 4,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 5px 15px rgba(33, 203, 243, .4)',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Proceed to Payment'}
          </PulseButton>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{ 
              minWidth: 120,
              borderRadius: '10px',
              py: 1,
              px: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 8px rgba(33, 203, 243, .3)',
            }}
          >
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default CustomizePage;