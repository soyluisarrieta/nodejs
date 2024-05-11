const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const { findAvailablePort } = require('./portUtils');
const { getLocalIpAddress } = require('./ipUtils');
const { getAllMessages, saveMessage } = require('./messageUtils');
const { createWindow } = require('./windowUtils');

// Función para crear el servidor
function createServer() {
  const server = express();

  // Configurar la ruta principal para servir la página HTML del cliente
  server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..' , 'client', 'index.html'));
  });

  // Servir archivos estáticos desde el directorio "client"
  server.use(express.static(path.join(__dirname,'..' , 'client')));

  // Encontrar un puerto disponible entre 3000 y 4000
  findAvailablePort(3000, 4000, (err, port) => {
    if (err) {
      console.error('Error finding available port:', err);
      return;
    }

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
  });
}

module.exports = { createServer };
