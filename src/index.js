import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ManualRate from './ManualRate.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ManualRate />
  </React.StrictMode>
);

reportWebVitals();
