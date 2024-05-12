const fs = require('node:fs')

const stats = fs.statSync('./archivo.txt')

console.log(
   // Si es un fichero
  stats.isFile(), // true

   // Si es un directorio
  stats.isDirectory(), // false

   // Si es un enlace simbólico
  stats.isSymbolicLink(), // false

   // Tamaño en byter
  stats.size // 12

)