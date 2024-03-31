/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import React from 'react';
import ReactDON from 'react-dom/client';
import App from './app/index';

import './index.css';

declare global {
  interface Window {
    electronAPI: {
      call: (event: any) => void,
      on: (callback: ((event: any, value: any) => void)) => void;
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('name').addEventListener('input', event => {
    const dataToSend = (event.target as any).value as string;
    window.electronAPI.call({ dataToSend });
  });

  window.electronAPI.on((event: any, value: any) => {
    document.getElementById('message').innerText = value.res
  })

  ReactDON.createRoot(document.getElementById('react-app')).render(React.createElement(App))
})

console.log('👋 This message is being logged by "renderer.js", included via webpack');
