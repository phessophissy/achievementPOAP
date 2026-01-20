import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './context/ToastContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
