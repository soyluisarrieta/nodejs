const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const os = require('os');

function getLocalIpAddress() {
    const ifaces = os.networkInterfaces();
    let ipAddress = 'localhost';

    Object.keys(ifaces).forEach(ifname => {
        ifaces[ifname].forEach(iface => {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddress = iface.address;
            }
        });
    });

    return ipAddress;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          nodeIntegration: true
      }
  });

  mainWindow.loadURL('http://' + getLocalIpAddress() + ':3000');
}

app.whenReady().then(() => {
  const server = express();

  // Servir la página principal del chat en la ruta raíz "/"
  server.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });

  // Servir archivos estáticos desde el directorio "public"
  server.use(express.static(path.join(__dirname, 'public')));

  // Iniciar el servidor en el puerto 3000 solo en la dirección IP local
  const expressServer = server.listen(3000, getLocalIpAddress(), () => {
      console.log('Server running on http://' + getLocalIpAddress() + ':3000');
  });

  const wss = new WebSocket.Server({ server: expressServer });

  wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
          const parsedMessage = message.toString();
          wss.clients.forEach(function each(client) {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(parsedMessage);
              }
          });
      });
  });

  createWindow();

  app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});



app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
