const { BrowserWindow, ipcMain } = require('electron');
const { getLocalIpAddress } = require('./ipUtils');
const path = require('path')

// Función para crear una nueva ventana del navegador
function createWindow(port) {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 800,
    minHeight: 400,
    frame: false,
    resizable: true,
    icon: './build/favicon-256x256.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, 'preload.js'),
      partition: `persist:${port}`,
    }
  });

  // Cargar la URL del servidor en la nueva ventana
  mainWindow.loadURL('http://' + getLocalIpAddress() + ':' + port);

  // Window buttons
  ipcMain.on('closeApp', () => mainWindow.close())
  ipcMain.on('minimizeApp', () => mainWindow.minimize())
  ipcMain.on('maxResApp', () => mainWindow.maximize())
}

module.exports = { createWindow };
