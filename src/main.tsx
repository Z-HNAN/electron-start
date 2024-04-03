import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

// JSBridge only web polyfill
if (!window.JSBridge) {
  window.JSBridge = {
    call: (...args) => { console.log('MOCK CALL', ...args); return Promise.resolve() },
    on: (...args) => { console.log('MOCK CALL', ...args); return Promise.resolve() },
    off: (...args) => { console.log('MOCK CALL', ...args); return Promise.resolve() },
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(React.createElement(App))
