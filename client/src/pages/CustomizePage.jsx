import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ShieldIcon from '@mui/icons-material/Shield';
import AppleIcon from '@mui/icons-material/Apple';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CustomizationPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const OptionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const steps = ['Select Certificate', 'Customize Options', 'Review & Confirm'];

const CustomizePage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1); // Start at step 1 since step 0 was completed on the home page
  const [selectedOptions, setSelectedOptions] = useState({
    revokeProtection: true,
    customEntitlements: false,
    extendedValidity: false,
    prioritySupport: false,
  });
  const [loading, setLoading] = useState(false);

  const certificateDetails = {
    standard: {
      name: 'Standard Certificate',
      price: 6.00,
      waitingPeriod: '72 hours',
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
    },
    instant: {
      name: 'Instant Certificate',
      price: 14.00,
      waitingPeriod: 'Instant',
      icon: <FlashOnIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
    }
  };

  const currentCertificate = certificateDetails[type] || certificateDetails.standard;

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
        price: currentCertificate.price,
        name: currentCertificate.name,
        waitingPeriod: currentCertificate.waitingPeriod
      } 
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <CustomizationPaper elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {currentCertificate.icon}
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold' }}>
                {currentCertificate.name}
              </Typography>
            </Box>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              {type === 'instant' 
                ? 'You selected the Instant Certificate option. Your certificate will be delivered immediately after payment.'
                : 'You selected the Standard Certificate option. Your certificate will be delivered within 72 hours after payment.'}
            </Alert>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
              <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Customize Your Certificate
            </Typography>
            
            <FormGroup>
              <OptionItem>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={selectedOptions.revokeProtection} 
                      onChange={() => handleOptionChange('revokeProtection')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        <ShieldIcon sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle' }} />
                        Revoke Protection
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ensures your certificate remains valid even if Apple attempts to revoke it.
                      </Typography>
                    </Box>
                  }
                />
              </OptionItem>
              
              <OptionItem>
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
                        <SettingsIcon sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle' }} />
                        Custom Entitlements
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add specific entitlements to your certificate for advanced functionality.
                      </Typography>
                    </Box>
                  }
                />
              </OptionItem>
              
              <OptionItem>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={selectedOptions.extendedValidity} 
                      onChange={() => handleOptionChange('extendedValidity')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        <AppleIcon sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle' }} />
                        Extended Validity Period
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Extends the validity period of your certificate beyond the standard duration.
                      </Typography>
                    </Box>
                  }
                />
              </OptionItem>
              
              <OptionItem>
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
                        Priority Support
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get priority assistance for any issues with your certificate.
                      </Typography>
                    </Box>
                  }
                />
              </OptionItem>
            </FormGroup>
          </CustomizationPaper>
        );
      case 2:
        return (
          <CustomizationPaper elevation={3}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Review Your Selection
            </Typography>
            
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f7', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {currentCertificate.icon}
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                  {currentCertificate.name}
                </Typography>
              </Box>
              
              <Typography variant="body1">
                <strong>Price:</strong> ${currentCertificate.price.toFixed(2)}
              </Typography>
              
              <Typography variant="body1">
                <strong>Delivery:</strong> {currentCertificate.waitingPeriod}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
              Selected Options
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {Object.entries(selectedOptions).map(([option, isSelected]) => (
                isSelected && (
                  <Box key={option} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {option === 'revokeProtection' && 'Revoke Protection'}
                      {option === 'customEntitlements' && 'Custom Entitlements'}
                      {option === 'extendedValidity' && 'Extended Validity Period'}
                      {option === 'prioritySupport' && 'Priority Support'}
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
            
            <Typography variant="h6" gutterBottom>
              Total: ${currentCertificate.price.toFixed(2)}
            </Typography>
            
            <Alert severity="info" sx={{ mt: 2 }}>
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
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
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
        >
          {activeStep === 1 ? 'Back to Home' : 'Back'}
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleProceedToPayment}
            disabled={loading}
            sx={{ 
              minWidth: 150,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Proceed to Payment'}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default CustomizePage;