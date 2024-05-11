const net = require('net');

const initialPort = 3000
const lastPort = 4000

// Función para encontrar un puerto disponible
function findAvailablePort(callback) {
  const checkPort = (port) => {
    const server = net.createServer();
    if (port === lastPort) { 
      return callback('Ports 3000 to 4000 are busy');
    }
    
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
  
  checkPort(initialPort);
}

module.exports = { findAvailablePort };
