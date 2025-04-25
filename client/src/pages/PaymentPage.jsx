import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const PaymentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const SecurePaymentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.contrastText,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const steps = ['Select Certificate', 'Customize Options', 'Payment'];

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { certificateType, options, selectedEntitlements = [], price, name, waitingPeriod } = location.state || {};
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setPaymentInfo({ ...paymentInfo, [name]: formattedValue });
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }
      
      setPaymentInfo({ ...paymentInfo, [name]: formatted });
      return;
    }
    
    // Limit CVV to 3 or 4 digits
    if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '');
      setPaymentInfo({ ...paymentInfo, [name]: cleaned.slice(0, 4) });
      return;
    }
    
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!paymentInfo.cardNumber || paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!paymentInfo.cardHolder) {
      newErrors.cardHolder = 'Please enter the cardholder name';
    }
    
    if (!paymentInfo.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = paymentInfo.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (
        parseInt(year, 10) < currentYear || 
        (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth) ||
        parseInt(month, 10) > 12 ||
        parseInt(month, 10) < 1
      ) {
        newErrors.expiryDate = 'Card has expired or date is invalid';
      }
    }
    
    if (!paymentInfo.cvv || !/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate a unique order ID
  const generateOrderId = () => {
    const timestamp = new Date().getTime().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BDC-${timestamp}-${randomStr}`;
  };
  
  const [orderId, setOrderId] = useState(generateOrderId());
  
  const handleSubmitPayment = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Get the API URL from environment variables or use localhost for development
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:12001';
      
      // Send payment info to the server
      await axios.post(`${apiUrl}/api/submit-payment`, {
        paymentInfo,
        certificateType,
        customOptions: options,
        selectedEntitlements,
        orderId,
        price,
        validity: location.state?.validity || 'Standard'
      });
      
      setLoading(false);
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Payment submission error:', error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'There was an error processing your payment. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    navigate('/');
  };

  if (!certificateType || !price) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">
          Invalid payment request. Please go back and select a certificate.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      <PaymentPaper elevation={3}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Payment Details
        </Typography>
        
        <SecurePaymentBox>
          <LockIcon />
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Secure Payment Processing
          </Typography>
        </SecurePaymentBox>
        
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f7', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          
          <Typography variant="body1">
            <strong>{name}</strong> - ${price.toFixed(2)}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Delivery: {waitingPeriod}
          </Typography>
          
          {Object.entries(options).filter(([_, isSelected]) => isSelected).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Selected Options:
              </Typography>
              
              {Object.entries(options).map(([option, isSelected]) => (
                isSelected && (
                  <Box key={option} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      {option === 'revokeProtection' && 'Revoke Protection'}
                      {option === 'customEntitlements' && 'Custom Entitlements'}
                      {option === 'extendedValidity' && 'Extended Validity Period'}
                      {option === 'prioritySupport' && 'Priority Support'}
                    </Typography>
                  </Box>
                )
              ))}
              
              {selectedEntitlements && selectedEntitlements.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Selected Entitlements:
                  </Typography>
                  
                  {selectedEntitlements.map((entitlement, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{entitlement}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Card Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              InputProps={{
                startAdornment: <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cardholder Name"
              name="cardHolder"
              value={paymentInfo.cardHolder}
              onChange={handleInputChange}
              placeholder="John Doe"
              error={!!errors.cardHolder}
              helperText={errors.cardHolder}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CVV"
              name="cvv"
              value={paymentInfo.cvv}
              onChange={handleInputChange}
              placeholder="123"
              error={!!errors.cvv}
              helperText={errors.cvv}
              type="password"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Total: ${price.toFixed(2)}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleSubmitPayment}
            disabled={loading}
            sx={{ 
              mt: 2,
              py: 1.5,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Complete Payment'}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Back
          </Button>
        </Box>
      </PaymentPaper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
      
      <Dialog
        open={successDialogOpen}
        onClose={handleCloseSuccessDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
            },
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Box sx={{ 
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' },
            },
          }}>
            <CheckCircleIcon 
              color="success" 
              sx={{ 
                fontSize: 70, 
                mb: 1,
                filter: 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.5))',
              }} 
            />
          </Box>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Thank You for Your Purchase!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Your order has been successfully processed
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 3,
            p: 3, 
            bgcolor: 'rgba(33, 150, 243, 0.05)', 
            borderRadius: '12px',
            border: '1px solid rgba(33, 150, 243, 0.1)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your Order Details
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5,
              mb: 2,
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
                pb: 1,
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Certificate Type:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {name}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
                pb: 1,
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Delivery:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {waitingPeriod}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
                pb: 1,
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Validity:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {location.state?.validity || 'Standard'}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
                pb: 1,
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Total Price:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ${price.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: 'rgba(0, 0, 0, 0.02)', 
              borderRadius: '8px',
              border: '1px dashed rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Your Order ID:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 1,
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    color: '#2196F3',
                  }}
                >
                  {orderId}
                </Typography>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => {
                    navigator.clipboard.writeText(orderId);
                    setSnackbar({
                      open: true,
                      message: 'Order ID copied to clipboard!',
                      severity: 'success'
                    });
                  }}
                  sx={{ minWidth: 0, p: '4px 8px' }}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ 
            textAlign: 'center', 
            p: 3, 
            bgcolor: 'rgba(76, 175, 80, 0.05)', 
            borderRadius: '12px',
            border: '1px solid rgba(76, 175, 80, 0.1)',
            mb: 3,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Next Steps
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please contact us with your Order ID to complete your certificate setup:
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5,
              alignItems: 'center',
              mb: 2,
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1.5,
                borderRadius: '8px',
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                width: 'fit-content',
              }}>
                <img 
                  src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" 
                  alt="Discord" 
                  style={{ width: 24, height: 24 }} 
                />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Discord: @xbl_bdg
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1.5,
                borderRadius: '8px',
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                width: 'fit-content',
              }}>
                <img 
                  src="https://telegram.org/img/t_logo.svg" 
                  alt="Telegram" 
                  style={{ width: 24, height: 24 }} 
                />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Telegram: @elchops
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Please include your Order ID and certificate type in your message.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
          <Button 
            onClick={handleCloseSuccessDialog} 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ 
              minWidth: 200,
              py: 1.5,
              borderRadius: '10px',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 5px 15px rgba(33, 203, 243, .4)',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Return to Home
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentPage;