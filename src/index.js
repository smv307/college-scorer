import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ManualRate from './ManualRate.js';
import AutoRate from './AutoRate.js'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ManualRate />
    <AutoRate />
  </React.StrictMode>
);

reportWebVitals();
