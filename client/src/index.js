// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Importing global styles
import App from './App';

// Get the root element from the HTML
const container = document.getElementById('root');
const root = createRoot(container);

// Render the App component to the DOM
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);