const { app } = require('electron');
const { createServer } = require('./server');

// Iniciar la aplicación cuando esté lista
app.whenReady().then(() => {
  createServer();
});

// Manejar evento de cierre de todas las ventanas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit(); // Cerrar la aplicación si no está en macOS
});
