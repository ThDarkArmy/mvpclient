import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline';
import theme from "./themes/Theme";
import { ThemeProvider } from '@mui/material/styles';

// import { global as globalThis } from 'global';

// Polyfill the global object
// if (typeof window.global === 'undefined') {
//   window.global = globalThis;
// }

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
  </ThemeProvider>,
  
)
