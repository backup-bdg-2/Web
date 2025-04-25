import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CustomizePage from './pages/CustomizePage';
import PaymentPage from './pages/PaymentPage';
import './App.css';

// Create a custom theme with vibrant colors and modern styling
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#ff9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    info: {
      main: '#03A9F4',
      light: '#4FC3F7',
      dark: '#0288D1',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
    },
    divider: 'rgba(0, 0, 0, 0.1)',
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(33, 150, 243, 0.08)',
      selected: 'rgba(33, 150, 243, 0.16)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.2,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
    '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.07),0px 5px 8px 0px rgba(0,0,0,0.05),0px 1px 14px 0px rgba(0,0,0,0.07)',
    '0px 4px 5px -2px rgba(0,0,0,0.08),0px 7px 10px 1px rgba(0,0,0,0.06),0px 2px 16px 1px rgba(0,0,0,0.08)',
    '0px 6px 10px -3px rgba(0,0,0,0.09),0px 10px 14px 1px rgba(0,0,0,0.07),0px 4px 18px 3px rgba(0,0,0,0.09)',
    '0px 7px 10px -4px rgba(0,0,0,0.1),0px 12px 17px 2px rgba(0,0,0,0.08),0px 5px 22px 4px rgba(0,0,0,0.1)',
    '0px 8px 12px -5px rgba(0,0,0,0.11),0px 15px 20px 2px rgba(0,0,0,0.09),0px 6px 24px 5px rgba(0,0,0,0.11)',
    '0px 9px 15px -6px rgba(0,0,0,0.12),0px 18px 24px 2px rgba(0,0,0,0.1),0px 7px 30px 5px rgba(0,0,0,0.12)',
    '0px 10px 16px -7px rgba(0,0,0,0.13),0px 20px 28px 2px rgba(0,0,0,0.11),0px 8px 34px 6px rgba(0,0,0,0.13)',
    '0px 11px 18px -8px rgba(0,0,0,0.14),0px 22px 32px 3px rgba(0,0,0,0.12),0px 9px 38px 7px rgba(0,0,0,0.14)',
    '0px 12px 20px -9px rgba(0,0,0,0.15),0px 24px 36px 3px rgba(0,0,0,0.13),0px 10px 42px 7px rgba(0,0,0,0.15)',
    '0px 13px 22px -10px rgba(0,0,0,0.16),0px 26px 40px 4px rgba(0,0,0,0.14),0px 11px 46px 8px rgba(0,0,0,0.16)',
    '0px 14px 24px -11px rgba(0,0,0,0.17),0px 28px 44px 4px rgba(0,0,0,0.15),0px 12px 50px 9px rgba(0,0,0,0.17)',
    '0px 15px 26px -12px rgba(0,0,0,0.18),0px 30px 48px 5px rgba(0,0,0,0.16),0px 13px 54px 10px rgba(0,0,0,0.18)',
    '0px 16px 28px -13px rgba(0,0,0,0.19),0px 32px 52px 5px rgba(0,0,0,0.17),0px 14px 58px 11px rgba(0,0,0,0.19)',
    '0px 17px 30px -14px rgba(0,0,0,0.2),0px 34px 56px 6px rgba(0,0,0,0.18),0px 15px 62px 12px rgba(0,0,0,0.2)',
    '0px 18px 32px -15px rgba(0,0,0,0.21),0px 36px 60px 6px rgba(0,0,0,0.19),0px 16px 66px 13px rgba(0,0,0,0.21)',
    '0px 19px 34px -16px rgba(0,0,0,0.22),0px 38px 64px 7px rgba(0,0,0,0.2),0px 17px 70px 14px rgba(0,0,0,0.22)',
    '0px 20px 36px -17px rgba(0,0,0,0.23),0px 40px 68px 7px rgba(0,0,0,0.21),0px 18px 74px 15px rgba(0,0,0,0.23)',
    '0px 21px 38px -18px rgba(0,0,0,0.24),0px 42px 72px 8px rgba(0,0,0,0.22),0px 19px 78px 16px rgba(0,0,0,0.24)',
    '0px 22px 40px -19px rgba(0,0,0,0.25),0px 44px 76px 8px rgba(0,0,0,0.23),0px 20px 82px 17px rgba(0,0,0,0.25)',
    '0px 23px 42px -20px rgba(0,0,0,0.26),0px 46px 80px 9px rgba(0,0,0,0.24),0px 21px 86px 18px rgba(0,0,0,0.26)',
    '0px 24px 44px -21px rgba(0,0,0,0.27),0px 48px 84px 9px rgba(0,0,0,0.25),0px 22px 90px 19px rgba(0,0,0,0.27)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(45deg, #FF9800 30%, #FFCA28 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
        },
        elevation5: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: '#fafafa'
        }}>
          <Header />
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/customize/:type" element={<CustomizePage />} />
              <Route path="/payment" element={<PaymentPage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
