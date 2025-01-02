import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainApp from './App'; // Import MainApp

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp /> // Use MainApp correctly here
  </React.StrictMode>
);
