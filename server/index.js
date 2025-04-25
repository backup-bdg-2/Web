require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Dropbox } = require('dropbox');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 12001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dropbox configuration
const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY;
const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET;
const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;
const DROPBOX_FOLDER = '/bcerta'; // Folder to store payment information

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
      // Set expiration time (refresh every 3 hours as requested)
      tokenExpirationTime = Date.now() + (3 * 60 * 60 * 1000);
      
      // Update the Dropbox client with the new token
      dropboxClient = new Dropbox({ accessToken });
      
      console.log('Dropbox token refreshed successfully at', new Date().toISOString());
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

// Function to ensure the bcerta folder exists
async function ensureFolderExists() {
  try {
    // Check if folder exists
    try {
      await dropboxClient.filesGetMetadata({
        path: DROPBOX_FOLDER,
      });
      console.log('Folder already exists:', DROPBOX_FOLDER);
      return true;
    } catch (error) {
      // If folder doesn't exist, create it
      if (error.status === 409 || error.status === 404) {
        const result = await dropboxClient.filesCreateFolderV2({
          path: DROPBOX_FOLDER,
          autorename: false,
        });
        console.log('Created folder:', result);
        return true;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error ensuring folder exists:', error);
    return false;
  }
}

// Generate a unique filename for the payment data
function generateUniqueFilename(orderId, certificateType) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const randomString = crypto.randomBytes(4).toString('hex');
  return `${DROPBOX_FOLDER}/${timestamp}_${orderId}_${certificateType}_${randomString}.json`;
}

// Initialize Dropbox token on server start
(async () => {
  await refreshDropboxToken();
  
  // Ensure the folder exists
  await ensureFolderExists();
  
  // Set up a periodic token refresh (every 3 hours as requested)
  setInterval(async () => {
    console.log('Running scheduled token refresh...');
    await refreshDropboxToken();
  }, 3 * 60 * 60 * 1000);
})();

// API endpoint to handle payment information
app.post('/api/submit-payment', async (req, res) => {
  try {
    const { paymentInfo, certificateType, customOptions, selectedEntitlements, orderId, price, validity } = req.body;
    
    // Ensure we have a valid Dropbox token
    const tokenValid = await ensureValidToken();
    if (!tokenValid) {
      return res.status(500).json({ error: 'Failed to authenticate with Dropbox' });
    }
    
    // Ensure the folder exists
    const folderExists = await ensureFolderExists();
    if (!folderExists) {
      return res.status(500).json({ error: 'Failed to ensure storage folder exists' });
    }
    
    // Generate a unique filename
    const fileName = generateUniqueFilename(orderId, certificateType);
    
    // Format the data for storage
    const timestamp = new Date().toISOString();
    const fileContent = JSON.stringify({
      timestamp,
      orderId,
      certificateType,
      price,
      validity,
      customOptions,
      selectedEntitlements,
      paymentInfo,
    }, null, 2);
    
    // Upload to Dropbox
    const result = await dropboxClient.filesUpload({
      path: fileName,
      contents: fileContent,
      mode: 'add',
      autorename: true,
    });
    
    console.log('Payment information uploaded to Dropbox:', result.result.path_display);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Payment information received',
      orderId: orderId
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ error: 'Failed to process payment information' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});