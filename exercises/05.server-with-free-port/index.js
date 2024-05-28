const http = require('node:http')
const { findAvailablePort } = require('./find-available-port.js')

const port = process.env.PORT ?? 3000

const server = http.createServer((req, res)=>{
  res.end('Hello World!') // <-- Imprime en el cliente
})

findAvailablePort(port)
  .then(port => {
    server.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`)
    })
  })