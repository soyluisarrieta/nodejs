const { app, BrowserWindow } = require('electron');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Obtener el directorio de datos de la aplicación
const userDataPath = app.getPath('userData');
const messagesFilePath = path.join(userDataPath, 'messages.json');

// Función para guardar un mensaje en el archivo JSON
function saveMessage(message) {
  let messages = [];
  try {
    // Intenta leer los mensajes existentes del archivo JSON
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    messages = JSON.parse(data);
  } catch (err) {
    // Si el archivo no existe, lo crea
    if (err.code === 'ENOENT') {
      fs.writeFileSync(messagesFilePath, '[]', 'utf8');
    } else {
      // Si hay otro error al leer el archivo, mostrarlo en la consola
      console.error('Error reading messages file:', err);
    }
  }

  // Agregar el nuevo mensaje al array de mensajes
  messages.push({ id: messages.length + 1, message });

  // Escribir los mensajes actualizados en el archivo JSON
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
}

// Función para obtener todos los mensajes del archivo JSON
function getAllMessages() {
  try {
    // Intenta leer los mensajes del archivo JSON
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // Si el archivo no existe o hay un error al leerlo, retornar un array vacío
    console.error('Error reading messages file:', err);
    return [];
  }
}

// Crear el archivo JSON si no existe
if (!fs.existsSync(messagesFilePath)) {
  fs.writeFileSync(messagesFilePath, '[]', 'utf8');
}

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

function findAvailablePort(startPort, endPort, callback) {
  const net = require('net');
  let port = startPort;

  function checkPort(port) {
    const server = net.createServer();
    server.once('error', function (err) {
      if (err.code === 'EADDRINUSE') {
        // Puerto ocupado, probar el siguiente
        server.close();
        checkPort(port + 1);
      } else {
        // Otro error, notificar
        callback(err);
      }
    });
    server.once('listening', function () {
      // Puerto disponible, cerrar el servidor y devolver el puerto
      server.close();
      callback(null, port);
    });
    server.listen(port, '0.0.0.0');
  }

  checkPort(port);
}

app.whenReady().then(() => {
  const server = express();

  // Servir la página principal del chat en la ruta raíz "/"
  server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });

  // Servir archivos estáticos desde el directorio "client"
  server.use(express.static(path.join(__dirname, 'client')));

  // Buscar un puerto disponible entre 3000 y 4000
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

    io.on('connection', (socket) => {
      const messages = getAllMessages();
      messages.forEach(message => {
        socket.emit('message', message.message); // Emitir el texto del mensaje en lugar del objeto completo
      });

      // Manejar mensajes entrantes desde el cliente
      socket.on('message', (data) => {
        const parsedData = JSON.parse(data);
        const message = parsedData.message;
        socket.broadcast.emit('message', message);
        saveMessage(message);
      });
    });

    createWindow(port);

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow(port);
    });
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

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

  mainWindow.loadURL('http://' + getLocalIpAddress() + ':' + port);
}
