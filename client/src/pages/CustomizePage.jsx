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
    extendedValidity: type === 'instant', // Auto-check for instant certificates
    prioritySupport: false,
  });
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedEntitlements, setSelectedEntitlements] = useState([]);

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
      // Skip adding price for extendedValidity if this is an instant certificate (it's included)
      if (isSelected && OPTION_PRICES[option] > 0 && !(option === 'extendedValidity' && type === 'instant')) {
        price += OPTION_PRICES[option];
      }
    });
    
    setTotalPrice(price);
  }, [selectedOptions, currentCertificate.basePrice, type]);

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
        selectedEntitlements: selectedEntitlements,
        price: totalPrice,
        name: currentCertificate.name,
        waitingPeriod: currentCertificate.waitingPeriod,
        validity: currentCertificate.validity
      } 
    });
  };
  
  // Available entitlements with descriptions - comprehensive list of Apple entitlements
  const availableEntitlements = [
    // Essential entitlements
    {
      id: 'get-task-allow',
      name: 'get-task-allow',
      description: 'Enables debugging capabilities for your app'
    },
    {
      id: 'com.apple.developer.team-identifier',
      name: 'Team Identifier',
      description: 'Identifies your development team for app signing'
    },
    {
      id: 'application-identifier',
      name: 'Application Identifier',
      description: 'Unique identifier for your application'
    },
    {
      id: 'keychain-access-groups',
      name: 'Keychain Access Groups',
      description: 'Allows sharing keychain items between apps'
    },
    
    // Security entitlements
    {
      id: 'com.apple.security.app-sandbox',
      name: 'App Sandbox',
      description: 'Contains damage to system and user data if app is compromised'
    },
    {
      id: 'com.apple.security.network.server',
      name: 'Network Server',
      description: 'Allows listening for incoming network connections'
    },
    {
      id: 'com.apple.security.network.client',
      name: 'Network Client',
      description: 'Allows opening outgoing network connections'
    },
    {
      id: 'com.apple.security.device.camera',
      name: 'Camera Access',
      description: 'Allows interaction with built-in and external cameras'
    },
    {
      id: 'com.apple.security.device.microphone',
      name: 'Microphone Access',
      description: 'Allows use of the microphone'
    },
    {
      id: 'com.apple.security.device.usb',
      name: 'USB Access',
      description: 'Allows interaction with USB devices'
    },
    {
      id: 'com.apple.security.device.bluetooth',
      name: 'Bluetooth Access',
      description: 'Allows interaction with Bluetooth devices'
    },
    {
      id: 'com.apple.security.personal-information.addressbook',
      name: 'Address Book Access',
      description: 'Allows read-write access to contacts in user\'s address book'
    },
    {
      id: 'com.apple.security.personal-information.location',
      name: 'Location Access',
      description: 'Allows access to location information from Location Services'
    },
    {
      id: 'com.apple.security.personal-information.calendars',
      name: 'Calendars Access',
      description: 'Allows read-write access to user\'s calendar'
    },
    {
      id: 'com.apple.security.personal-information.photos-library',
      name: 'Photos Library Access',
      description: 'Allows read-write access to user\'s Photos library'
    },
    {
      id: 'com.apple.security.application-groups',
      name: 'App Groups',
      description: 'Allows sharing data between apps from the same developer'
    },
    {
      id: 'com.apple.security.automation.apple-events',
      name: 'Apple Events',
      description: 'Allows sending Apple events to other apps'
    },
    {
      id: 'com.apple.security.cs.allow-jit',
      name: 'JIT Compilation',
      description: 'Allows creating writable and executable memory using MAP_JIT flag'
    },
    {
      id: 'com.apple.security.cs.allow-unsigned-executable-memory',
      name: 'Unsigned Executable Memory',
      description: 'Allows creating writable and executable memory without MAP_JIT restrictions'
    },
    {
      id: 'com.apple.security.cs.allow-dyld-environment-variables',
      name: 'DYLD Environment Variables',
      description: 'Allows app to be affected by dynamic linker environment variables'
    },
    {
      id: 'com.apple.security.cs.disable-library-validation',
      name: 'Disable Library Validation',
      description: 'Allows loading arbitrary plugins or frameworks without code signing'
    },
    {
      id: 'com.apple.security.cs.disable-executable-page-protection',
      name: 'Disable Executable Protection',
      description: 'Disables all code signing protections during app execution'
    },
    {
      id: 'com.apple.security.cs.debugger',
      name: 'Debugger',
      description: 'Allows app to attach to other processes or get task ports'
    },
    {
      id: 'com.apple.security.device.audio-input',
      name: 'Audio Input',
      description: 'Allows recording audio using built-in microphone'
    },
    {
      id: 'com.apple.security.hypervisor',
      name: 'Hypervisor',
      description: 'Allows creating and managing virtual machines'
    },
    {
      id: 'com.apple.security.virtualization',
      name: 'Virtualization',
      description: 'Allows using the Virtualization framework'
    },
    {
      id: 'com.apple.security.smartcard',
      name: 'Smart Card',
      description: 'Allows access to smart card slots and smart cards'
    },
    
    // Networking entitlements
    {
      id: 'com.apple.developer.networking.vpn.api',
      name: 'VPN API',
      description: 'Enables VPN capabilities in your app'
    },
    {
      id: 'com.apple.developer.networking.networkextension',
      name: 'Network Extension',
      description: 'Allows creating and controlling network tunnels'
    },
    {
      id: 'com.apple.developer.networking.multipath',
      name: 'Multipath Networking',
      description: 'Enables using multiple network paths simultaneously'
    },
    {
      id: 'com.apple.developer.networking.HotspotConfiguration',
      name: 'Hotspot Configuration',
      description: 'Allows configuring Wi-Fi hotspots'
    },
    {
      id: 'com.apple.developer.networking.wifi-info',
      name: 'WiFi Info Access',
      description: 'Provides access to WiFi network information'
    },
    {
      id: 'com.apple.developer.networking.multicast',
      name: 'Multicast',
      description: 'Allows sending or receiving IP multicast traffic'
    },
    {
      id: 'com.apple.developer.networking.manage-thread-network-credentials',
      name: 'Thread Network',
      description: 'Allows using ThreadNetwork'
    },
    {
      id: 'com.apple.developer.networking.vmnet',
      name: 'VM Networking',
      description: 'Allows virtual machine networking capabilities'
    },
    {
      id: 'com.apple.developer.associated-domains',
      name: 'Associated Domains',
      description: 'Enables universal links and shared web credentials'
    },
    {
      id: 'com.apple.developer.associated-domains.applinks.read-write',
      name: 'App Links Read-Write',
      description: 'Allows app to use universal links'
    },
    
    // Authentication and identity entitlements
    {
      id: 'com.apple.developer.authentication-services.autofill-credential-provider',
      name: 'AutoFill Credential Provider',
      description: 'Allows providing usernames and passwords for AutoFill'
    },
    {
      id: 'com.apple.developer.applesignin',
      name: 'Sign in with Apple',
      description: 'Enables Sign in with Apple functionality'
    },
    {
      id: 'com.apple.developer.secure-element-credential',
      name: 'Secure Element Credential',
      description: 'Allows using the SecureElementCredential framework'
    },
    {
      id: 'com.apple.developer.secure-element-credential.default-contactless-app',
      name: 'Default Contactless App',
      description: 'Allows becoming the default contactless app'
    },
    
    // Health and fitness entitlements
    {
      id: 'com.apple.developer.healthkit',
      name: 'HealthKit',
      description: 'Allows access to health and activity data'
    },
    {
      id: 'com.apple.developer.healthkit.access',
      name: 'HealthKit Capabilities',
      description: 'Enables access to specific health data types'
    },
    {
      id: 'com.apple.developer.healthkit.background-delivery',
      name: 'HealthKit Background Delivery',
      description: 'Allows receiving health updates while in background'
    },
    {
      id: 'com.apple.developer.healthkit.recalibrate-estimates',
      name: 'HealthKit Recalibration',
      description: 'Allows recalibrating health prediction algorithms'
    },
    
    // Home automation entitlements
    {
      id: 'com.apple.developer.homekit',
      name: 'HomeKit',
      description: 'Allows managing HomeKit-compatible accessories'
    },
    {
      id: 'com.apple.developer.matter.allow-setup-payload',
      name: 'Matter Setup Payload',
      description: 'Allows providing Matter Setup payload for device setup'
    },
    
    // iCloud entitlements
    {
      id: 'com.apple.developer.icloud-container-identifiers',
      name: 'iCloud Container Identifiers',
      description: 'Specifies container identifiers for iCloud production'
    },
    {
      id: 'com.apple.developer.icloud-services',
      name: 'iCloud Services',
      description: 'Specifies iCloud services used by the app'
    },
    {
      id: 'com.apple.developer.ubiquity-kvstore-identifier',
      name: 'iCloud Key-Value Store',
      description: 'Specifies container for iCloud key-value storage'
    },
    {
      id: 'com.apple.developer.icloud-container-environment',
      name: 'iCloud Container Environment',
      description: 'Specifies development or production environment for iCloud'
    },
    
    // Siri and voice entitlements
    {
      id: 'com.apple.developer.siri',
      name: 'Siri',
      description: 'Enables Siri integration with your app'
    },
    {
      id: 'com.apple.developer.calling-app',
      name: 'Default Calling App',
      description: 'Allows app to be the default calling app'
    },
    {
      id: 'com.apple.developer.messaging-app',
      name: 'Default Messaging App',
      description: 'Allows app to be the default messaging app'
    },
    {
      id: 'com.apple.developer.push-to-talk',
      name: 'Push to Talk',
      description: 'Enables push-to-talk functionality'
    },
    
    // Media and CarPlay entitlements
    {
      id: 'com.apple.developer.carplay-audio',
      name: 'CarPlay Audio',
      description: 'Enables audio playback in CarPlay'
    },
    {
      id: 'com.apple.developer.carplay-charging',
      name: 'CarPlay Charging',
      description: 'Enables charging functionality in CarPlay'
    },
    {
      id: 'com.apple.developer.carplay-communication',
      name: 'CarPlay Communication',
      description: 'Enables communication features in CarPlay'
    },
    {
      id: 'com.apple.developer.carplay-maps',
      name: 'CarPlay Maps',
      description: 'Enables maps functionality in CarPlay'
    },
    {
      id: 'com.apple.developer.carplay-parking',
      name: 'CarPlay Parking',
      description: 'Enables parking features in CarPlay'
    },
    {
      id: 'com.apple.developer.carplay-quick-ordering',
      name: 'CarPlay Quick Ordering',
      description: 'Enables quick ordering features in CarPlay'
    },
    {
      id: 'com.apple.developer.media-device-discovery-extension',
      name: 'Media Device Discovery',
      description: 'Adds third-party media receivers to system device-picker'
    },
    {
      id: 'com.apple.developer.coremotion.head-pose',
      name: 'Head Pose',
      description: 'Uses head movement for spatialized sound orientation'
    },
    {
      id: 'com.apple.developer.spatial-audio.profile-access',
      name: 'Spatial Audio Profile',
      description: 'Enables use of personalized spatial audio profile'
    },
    
    // Payments and wallet entitlements
    {
      id: 'com.apple.developer.in-app-payments',
      name: 'In-App Payments',
      description: 'Enables payment processing in your app'
    },
    {
      id: 'com.apple.developer.pass-type-identifiers',
      name: 'Pass Type IDs',
      description: 'Specifies pass types your app can access in Wallet'
    },
    {
      id: 'com.apple.developer.in-app-identity-presentment',
      name: 'In-App Identity Presentment',
      description: 'Enables identity verification features'
    },
    {
      id: 'com.apple.developer.proximity-reader.identity.display',
      name: 'ID Verifier - Display Only',
      description: 'Allows displaying identity verification information'
    },
    {
      id: 'com.apple.developer.proximity-reader.identity.read',
      name: 'ID Verifier - Data Transfer',
      description: 'Allows reading identity verification data'
    },
    
    // Game and entertainment entitlements
    {
      id: 'com.apple.developer.game-center',
      name: 'Game Center',
      description: 'Enables Game Center features like leaderboards'
    },
    {
      id: 'com.apple.developer.group-session',
      name: 'Group Session',
      description: 'Allows implementing shared group experiences'
    },
    {
      id: 'com.apple.developer.user-management',
      name: 'User Management',
      description: 'Allows distinguishing between multiple user accounts on Apple TV'
    },
    {
      id: 'com.apple.developer.video-subscriber-single-sign-on',
      name: 'TV Provider Authentication',
      description: 'Enables TV Provider Authentication service'
    },
    
    // Web and browser entitlements
    {
      id: 'com.apple.developer.web-browser',
      name: 'Web Browser',
      description: 'Allows app to act as the default web browser'
    },
    {
      id: 'com.apple.developer.web-browser.public-key-credential',
      name: 'Web Browser Public Key Credential',
      description: 'Allows handling passkeys and security keys'
    },
    {
      id: 'com.apple.developer.browser.app-installation',
      name: 'Browser App Installation',
      description: 'Enables browser to install alternative-distribution apps'
    },
    {
      id: 'com.apple.developer.embedded-web-browser-engine',
      name: 'Embedded Web Browser Engine',
      description: 'Allows embedding a web browser engine'
    },
    
    // Wireless and NFC entitlements
    {
      id: 'com.apple.external-accessory.wireless-configuration',
      name: 'Wireless Accessory Configuration',
      description: 'Allows configuring MFi Wi-Fi accessories'
    },
    {
      id: 'com.apple.developer.nfc.readersession.formats',
      name: 'NFC Tag Reader Formats',
      description: 'Specifies NFC data formats app can read'
    },
    {
      id: 'com.apple.developer.nfc.hce',
      name: 'NFC Card Session',
      description: 'Allows using the NFC card session API'
    },
    {
      id: 'com.apple.developer.nfc.hce.default-contactless-app',
      name: 'Default NFC Contactless App',
      description: 'Allows being default app for contactless NFC'
    },
    
    // Enterprise and advanced entitlements
    {
      id: 'com.apple.developer.coreml.neural-engine-access',
      name: 'Apple Neural Engine Access',
      description: 'Allows using Apple Neural Engine to speed up CoreML'
    },
    {
      id: 'com.apple.developer.app-compute-category',
      name: 'Increased Performance Headroom',
      description: 'Allows adjusting thermal and performance thresholds'
    },
    {
      id: 'com.apple.developer.screen-capture.include-passthrough',
      name: 'Passthrough in Screen Capture',
      description: 'Allows including passthrough in screen capture'
    },
    {
      id: 'com.apple.developer.arkit.main-camera-access.allow',
      name: 'Main Camera Access',
      description: 'Allows ARKit to access main cameras on Apple Vision Pro'
    },
    {
      id: 'com.apple.developer.arkit.object-tracking-parameter-adjustment.allow',
      name: 'Object-tracking Parameter Adjustment',
      description: 'Allows ARKit to track more objects with higher frequency'
    },
    {
      id: 'com.apple.developer.arkit.barcode-detection.allow',
      name: 'Spatial Barcode and QR Scanning',
      description: 'Allows ARKit to detect and decode barcodes and QR codes'
    },
    {
      id: 'com.apple.developer.avfoundation.uvc-device-access',
      name: 'UVC Device Access',
      description: 'Allows streaming USB UVC devices on visionOS'
    },
    {
      id: 'com.apple.developer.kernel.increased-memory-limit',
      name: 'Increased Memory Limit',
      description: 'Allows core features to use higher memory limit'
    },
    {
      id: 'com.apple.developer.kernel.extended-virtual-addressing',
      name: 'Extended Virtual Addressing',
      description: 'Allows access to extended address space'
    },
    {
      id: 'com.apple.developer.sustained-execution',
      name: 'Sustained Execution',
      description: 'Enables consistent performance at sustainable levels'
    },
    {
      id: 'com.apple.developer.persistent-content-capture',
      name: 'Persistent Content Capture',
      description: 'Allows VNC apps persistent access to screen capture'
    },
    
    // Other specialized entitlements
    {
      id: 'com.apple.developer.ClassKit-environment',
      name: 'ClassKit Environment',
      description: 'Enables integration with Schoolwork app'
    },
    {
      id: 'com.apple.developer.automatic-assessment-configuration',
      name: 'Automatic Assessment Configuration',
      description: 'Allows creating assessment sessions'
    },
    {
      id: 'com.apple.developer.mail-client',
      name: 'Default Mail Client',
      description: 'Allows app to be the default email client'
    },
    {
      id: 'com.apple.developer.exposure-notification',
      name: 'Exposure Notification',
      description: 'Allows using exposure notification system'
    },
    {
      id: 'com.apple.developer.family-controls',
      name: 'Family Controls',
      description: 'Allows providing parental controls'
    },
    {
      id: 'com.apple.developer.fileprovider.testing-mode',
      name: 'File Provider Testing Mode',
      description: 'Allows placing domains in testing mode'
    },
    {
      id: 'com.apple.developer.journal.allow',
      name: 'Journaling Suggestions',
      description: 'Enables presenting journaling suggestions picker'
    },
    {
      id: 'com.apple.developer.location.push',
      name: 'Location Push',
      description: 'Allows querying location in response to push notification'
    },
    {
      id: 'com.apple.developer.managed-app-distribution.install-ui',
      name: 'Managed App Installation UI',
      description: 'Enables using Managed App Distribution'
    },
    {
      id: 'com.apple.developer.sensitivecontentanalysis.client',
      name: 'Sensitive Content Analysis',
      description: 'Enables detecting nudity in images and video'
    },
    {
      id: 'com.apple.developer.sensorkit.reader.allow',
      name: 'SensorKit Reader',
      description: 'Allows access to sensor data for research studies'
    },
    {
      id: 'com.apple.developer.weatherkit',
      name: 'WeatherKit',
      description: 'Allows using WeatherKit for weather data'
    },
    {
      id: 'com.apple.developer.translation-app',
      name: 'Translation',
      description: 'Allows app to be the default translation app'
    },
    {
      id: 'com.apple.developer.navigation-app',
      name: 'Default Navigation',
      description: 'Allows app to be the default navigation app'
    },
    {
      id: 'com.apple.developer.marketplace.app-installation',
      name: 'Alternative App Marketplace',
      description: 'Enables app to vend other apps as alternative marketplace'
    }
  ];
  
  // Handle entitlement selection
  const handleEntitlementToggle = (entitlementId) => {
    setSelectedEntitlements(prev => {
      if (prev.includes(entitlementId)) {
        return prev.filter(id => id !== entitlementId);
      } else {
        return [...prev, entitlementId];
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
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
                py: 1,
                px: 2,
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
              }}>
                <AttachMoneyIcon sx={{ mr: 0.5 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Total: ${totalPrice.toFixed(2)}
                </Typography>
              </Box>
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
                      disabled={type === 'instant'} // Already included for instant
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
                          ? 'Automatically included with Instant Certificate for enhanced security.' 
                          : 'Extends the revoke protection capabilities of your certificate for better long-term reliability.'}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%' }}
                />
                {type === 'instant' ? (
                  <Tooltip title="Automatically included with Instant Certificate">
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
            
            {selectedOptions.customEntitlements && (
              <Box sx={{ mt: 4, mb: 2 }}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle', color: theme.palette.primary.main }} />
                  Select Custom Entitlements
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Choose the specific entitlements you want included in your certificate. These provide additional capabilities for your apps.
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                  mb: 3
                }}>
                  {availableEntitlements.map((entitlement) => (
                    <Paper 
                      key={entitlement.id}
                      elevation={selectedEntitlements.includes(entitlement.id) ? 3 : 1}
                      sx={{
                        p: 2,
                        borderRadius: '10px',
                        border: selectedEntitlements.includes(entitlement.id) 
                          ? `1px solid ${theme.palette.primary.main}` 
                          : `1px solid ${theme.palette.divider}`,
                        background: selectedEntitlements.includes(entitlement.id) 
                          ? 'rgba(33, 150, 243, 0.05)' 
                          : 'transparent',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                      onClick={() => handleEntitlementToggle(entitlement.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {entitlement.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {entitlement.description}
                          </Typography>
                        </Box>
                        <Checkbox 
                          checked={selectedEntitlements.includes(entitlement.id)} 
                          color="primary"
                          sx={{ p: 0.5 }}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
            
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