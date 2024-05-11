const { app, BrowserWindow } = require('electron');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const os = require('os');
const fs = require('fs');

const userDataPath = app.getPath('userData');
const messagesFilePath = path.join(userDataPath, 'messages.json');

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

function getAllMessages() {
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading messages file:', err);
    return [];
  }
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

app.whenReady().then(() => {
  const server = express();
  server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });
  server.use(express.static(path.join(__dirname, 'client')));
  findAvailablePort(3000, 4000, (err, port) => {
    if (err) {
      console.error('Error finding available port:', err);
      return;
    }
    app.commandLine.appendSwitch('disk-cache-dir', path.join(app.getPath('userData'), 'cache'));
    const httpServer = http.createServer(server);
    const expressServer = httpServer.listen(port, '0.0.0.0', () => {
      console.log('Server running on http://' + getLocalIpAddress() + ':' + port);
    });
    const io = socketio(expressServer);
    io.on('connection', socket => {
      getAllMessages().forEach(message => {
        socket.emit('message', message.message);
      });
      socket.on('message', data => {
        const parsedData = JSON.parse(data);
        const message = parsedData.message;
        socket.broadcast.emit('message', message);
        saveMessage(message);
      });
    });
    createWindow(port);
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow(port);
    });
  });
});

app.on('window-all-closed', () => {
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
