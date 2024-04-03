// Native
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

// Packages
import { BrowserWindow, app, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import { webEventHandler } from './handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const height = 600;
const width = 800;

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    // frame: false,
    // show: true,
    // resizable: true,
    // fullscreenable: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }

  // Open the DevTools.
  window.webContents.openDevTools();

  ipcMain.on('close', () => {
    window.close();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// call
ipcMain.on('web2Native', async (event, args) => {
  const { func = '', param = {}, callbackId } = args;
  const res = await webEventHandler(func, param, { send: event.sender.send.bind(event.sender, 'native2Web') })
  event.sender.send('native2Web', { callbackId, res });
});
