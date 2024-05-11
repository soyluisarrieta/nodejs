const { app, BrowserWindow } = require('electron');
const { createServer } = require('./server');

// Iniciar la aplicación cuando esté lista
app.whenReady().then(() => {
  // Crear el servidor
  createServer();
});

// Manejar evento de cierre de todas las ventanas
app.on('window-all-closed', () => {
  // Cerrar la aplicación si no está en macOS
  if (process.platform !== 'darwin') app.quit();
});
