import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './i18n'; // <<< add this line

createRoot(document.getElementById('root')).render(<App />);
