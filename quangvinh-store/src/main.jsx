import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '@fontsource/poppins';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import {AuthProvider} from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {CartProvider} from "./context/CartContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="677057298535-b4j78u3vhem3nngcbav939teijdbht3d.apps.googleusercontent.com">
            <BrowserRouter>
                <AuthProvider>
                    <CartProvider>
                        <ThemeProvider>
                            <App />
                        </ThemeProvider>
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
