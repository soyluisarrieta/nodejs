import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

let selectedPort = null;

const app = express();
const io = new Server();

// Función para comprobar puertos disponibles
const findAvailablePort = async () => {
  for (let port = 3000; port <= 4000; port++) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
          server.close();
          resolve(port);
        });
        server.on('error', reject);
      });
      selectedPort = port;
      break;
    } catch (err) {
      console.log(`Port ${port} is in use.`);
    }
  }
};

// Iniciar servidor
const startServer = async () => {
  await findAvailablePort();
  const server = createServer(app);
  io.attach(server);
  
  io.on('connection', (socket) => {
    console.log('An user has connected!')

    socket.on('disconnect', () => {
      console.log('An user has disconnected')
    })

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg)
    })
  })

  app.use(logger('dev'), express.static('client'))

  app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
  })

  server.listen(selectedPort, () => {
    console.log(`Server running on port ${selectedPort}`)
  })
};

startServer();
