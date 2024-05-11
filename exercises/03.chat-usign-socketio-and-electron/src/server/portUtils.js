const net = require('net');

// Función para encontrar un puerto disponible
function findAvailablePort(startPort, endPort, callback) {
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

module.exports = { findAvailablePort };
