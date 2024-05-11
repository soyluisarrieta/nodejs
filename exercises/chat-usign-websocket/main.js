const { app, BrowserWindow } = require('electron');
const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'messages.db'); // Ruta absoluta para la base de datos

// Conexión a la base de datos SQLite
const db = new sqlite3.Database(dbPath);

// Crear tabla para almacenar mensajes si no existe
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, message TEXT)");
});

// Almacenar mensaje en la base de datos
function saveMessage(message) {
  db.run("INSERT INTO messages (message) VALUES (?)", [message], (err) => {
    if (err) {
      console.error('Error saving message:', err);
    }
  });
}

// Obtener todos los mensajes almacenados en la base de datos
function getAllMessages(callback) {
  db.all("SELECT * FROM messages", [], (err, rows) => {
    if (err) {
      console.error('Error getting messages:', err);
      callback([]);
    } else {
      // Mapear los objetos de mensaje a sus textos respectivos
      const messages = rows.map(row => row.message);
      callback(messages);
    }
  });
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

  // Servir archivos estáticos desde el directorio "public"
  server.use(express.static(path.join(__dirname, 'public')));

  // Buscar un puerto disponible entre 3000 y 4000
  findAvailablePort(3000, 4000, (err, port) => {
    if (err) {
      console.error('Error finding available port:', err);
      return;
    }

    // Configurar directorio de caché personalizado para Electron
    app.commandLine.appendSwitch('disk-cache-dir', path.join(app.getPath('userData'), 'cache'));

    // Iniciar el servidor en el puerto disponible
    const expressServer = server.listen(port, '0.0.0.0', () => {
      console.log('Server running on http://' + getLocalIpAddress() + ':' + port);
    });

    const wss = new WebSocket.Server({ server: expressServer });

    wss.on('connection', function connection(ws) {
      getAllMessages(messages => {
        messages.forEach(message => {
          ws.send(message); // Enviar el texto del mensaje en lugar del objeto completo
        });
      });

      // Manejar mensajes entrantes desde el cliente
      ws.on('message', function incoming(data) {
        const parsedData = JSON.parse(data.toString())
        const message = parsedData.message;
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });

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
