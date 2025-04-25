require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Dropbox } = require('dropbox');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 12001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dropbox configuration
const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY;
const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET;
const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;

// Initialize Dropbox client
let dropboxClient = null;
let accessToken = null;
let tokenExpirationTime = null;

// Function to refresh the Dropbox access token
async function refreshDropboxToken() {
  try {
    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: DROPBOX_REFRESH_TOKEN,
        client_id: DROPBOX_APP_KEY,
        client_secret: DROPBOX_APP_SECRET,
      }),
    });

    const data = await response.json();
    
    if (data.access_token) {
      accessToken = data.access_token;
      // Set expiration time (usually 4 hours, but we'll refresh after 3.5 hours to be safe)
      tokenExpirationTime = Date.now() + (3.5 * 60 * 60 * 1000);
      
      // Update the Dropbox client with the new token
      dropboxClient = new Dropbox({ accessToken });
      
      console.log('Dropbox token refreshed successfully');
      return true;
    } else {
      console.error('Failed to refresh Dropbox token:', data);
      return false;
    }
  } catch (error) {
    console.error('Error refreshing Dropbox token:', error);
    return false;
  }
}

// Function to ensure we have a valid token
async function ensureValidToken() {
  if (!accessToken || !tokenExpirationTime || Date.now() >= tokenExpirationTime) {
    return await refreshDropboxToken();
  }
  return true;
}

// Initialize Dropbox token on server start
(async () => {
  await refreshDropboxToken();
  
  // Set up a periodic token refresh (every 3.5 hours)
  setInterval(refreshDropboxToken, 3.5 * 60 * 60 * 1000);
})();

// API endpoint to handle payment information
app.post('/api/submit-payment', async (req, res) => {
  try {
    const { paymentInfo, certificateType, customOptions } = req.body;
    
    // Ensure we have a valid Dropbox token
    const tokenValid = await ensureValidToken();
    if (!tokenValid) {
      return res.status(500).json({ error: 'Failed to authenticate with Dropbox' });
    }
    
    // Format the data for storage
    const timestamp = new Date().toISOString();
    const fileName = `/${timestamp}-${certificateType}-payment.json`;
    const fileContent = JSON.stringify({
      timestamp,
      certificateType,
      customOptions,
      paymentInfo,
    }, null, 2);
    
    // Upload to Dropbox
    const result = await dropboxClient.filesUpload({
      path: fileName,
      contents: fileContent,
      mode: 'add',
      autorename: true,
    });
    
    console.log('File uploaded to Dropbox:', result);
    
    return res.status(200).json({ success: true, message: 'Payment information received' });
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ error: 'Failed to process payment information' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});