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
  const { certificateType, options, price, name, waitingPeriod } = location.state || {};
  
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
        customOptions: options
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
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
          <Typography variant="h5" component="div">
            Thank You for Your Purchase!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center' }}>
            Your payment has been successfully processed. Please contact @xbl_bdg on Discord or @elchops on Telegram and let them know which certificate you purchased.
          </DialogContentText>
          <Box sx={{ textAlign: 'center', mt: 3, p: 2, bgcolor: '#f5f5f7', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Certificate Type: {name}
            </Typography>
            <Typography variant="body2">
              Delivery: {waitingPeriod}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleCloseSuccessDialog} 
            variant="contained" 
            color="primary"
            sx={{ 
              minWidth: 150,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
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