const { app, BrowserWindow } = require('electron');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Rutas de los archivos de datos
const userDataPath = app.getPath('userData');
const messagesFilePath = path.join(userDataPath, 'messages.json');

// Función para guardar un mensaje en el archivo JSON
function saveMessage(message) {
  let messages = [];
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    messages = JSON.parse(data);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error reading messages file:', err);
    }
  }
  messages.push({ id: messages.length + 1, message });
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
}

// Función para obtener todos los mensajes del archivo JSON
function getAllMessages() {
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading messages file:', err);
    return [];
  }
}

// Función para obtener la dirección IP local
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

// Función para encontrar un puerto disponible
function findAvailablePort(startPort, endPort, callback) {
  const net = require('net');
  let port = startPort;
  function checkPort(port) {
    const server = net.createServer();
    server.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        server.close();
        checkPort(port + 1);
      } else {
        callback(err);
      }
    });
    server.once('listening', () => {
      server.close();
      callback(null, port);
    });
    server.listen(port, '0.0.0.0');
  }
  checkPort(port);
}

// Iniciar la aplicación cuando esté lista
app.whenReady().then(() => {
  const server = express();

  // Configurar la ruta principal para servir la página HTML del cliente
  server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });

  // Servir archivos estáticos desde el directorio "client"
  server.use(express.static(path.join(__dirname, 'client')));

  // Encontrar un puerto disponible entre 3000 y 4000
  findAvailablePort(3000, 4000, (err, port) => {
    if (err) {
      console.error('Error finding available port:', err);
      return;
    }

    // Configurar directorio de caché personalizado para Electron
    app.commandLine.appendSwitch('disk-cache-dir', path.join(app.getPath('userData'), 'cache'));

    // Crear el servidor HTTP
    const httpServer = http.createServer(server);

    // Iniciar el servidor HTTP en el puerto disponible
    const expressServer = httpServer.listen(port, '0.0.0.0', () => {
      console.log('Server running on http://' + getLocalIpAddress() + ':' + port);
    });

    // Inicializar Socket.IO y asociarlo al servidor HTTP
    const io = socketio(expressServer);

    // Manejar conexiones de Socket.IO
    io.on('connection', socket => {
      getAllMessages().forEach(data => {
        socket.emit('chat message', data.message);
      });
      socket.on('chat message', message => {
        socket.broadcast.emit('chat message', message);
        saveMessage(message);
      });
    });

    // Crear ventana del navegador con el puerto proporcionado
    createWindow(port);

    // Manejar eventos de activación de la aplicación
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow(port);
    });
  });
});

// Manejar evento de cierre de todas las ventanas
app.on('window-all-closed', () => {
  // Cerrar la aplicación si no está en macOS
  if (process.platform !== 'darwin') app.quit();
});

// Función para crear una nueva ventana del navegador
function createWindow(port) {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      partition: `persist:${port}`
    }
  });
  // Cargar la URL del servidor en la nueva ventana
  mainWindow.loadURL('http://' + getLocalIpAddress() + ':' + port);
}
