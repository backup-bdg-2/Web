import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentIcon from '@mui/icons-material/Payment';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f7',
  padding: theme.spacing(4, 0),
  marginTop: 'auto',
}));

const FooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
              Apple Certificate Store
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Premium Apple certificates with custom entitlements and revoke protection.
            </Typography>
          </Box>
          
          <Box>
            <FooterSection>
              <SecurityIcon color="primary" />
              <Typography variant="body2">Secure Transactions</Typography>
            </FooterSection>
            
            <FooterSection>
              <SupportAgentIcon color="primary" />
              <Typography variant="body2">24/7 Support</Typography>
            </FooterSection>
            
            <FooterSection>
              <PaymentIcon color="primary" />
              <Typography variant="body2">Multiple Payment Options</Typography>
            </FooterSection>
          </Box>
        </Box>
        
        <Box sx={{ borderTop: '1px solid #ddd', pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Apple Certificate Store. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Contact us: <Link href="https://discord.com" target="_blank" rel="noopener">@xbl_bdg on Discord</Link> or <Link href="https://telegram.org" target="_blank" rel="noopener">@elchops on Telegram</Link>
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;