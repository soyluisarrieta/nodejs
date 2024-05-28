const http = require('node:http')

const port = process.env.PORT ?? 3000

// Crear servidor http
const server = http.createServer((request, response)=>{
  console.log('Request:',request) // <-- Imprime por la terminal
  response.end('Hello World!') // <-- Imprime en el cliente
})

// Escuchar en el puerto 3000 o en el que establezca
server.listen(port, () => {
  console.log(`Server running on port http://localhost:${server.address().port}`)
})
// Si se establece en el puerto 0
// node usará un puerto disponible al azar