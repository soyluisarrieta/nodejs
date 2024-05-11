const { BrowserWindow } = require('electron');
const { getLocalIpAddress } = require('./ipUtils');

// Función para crear una nueva ventana del navegador
function createWindow(port) {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './build/favicon-256x256.png',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      partition: `persist:${port}`
    }
  });

  // Quita el menú
  mainWindow.setMenu(null);
  
  // Cargar la URL del servidor en la nueva ventana
  mainWindow.loadURL('http://' + getLocalIpAddress() + ':' + port);
}

module.exports = { createWindow };
