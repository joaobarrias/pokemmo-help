// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const originalConsoleLog = console.log;
console.log = (...args) => {
  if (args[0]?.includes?.("Removing unpermitted intrinsics")) return;
  originalConsoleLog(...args);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)