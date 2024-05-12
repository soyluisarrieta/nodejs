// 🔰 IMPRESIÓN
//🔹 El console log, info y error se muestran igual en la consola
console.log('Hello world1!')
console.info('Hello world2!')
console.error('Hello world3!')


// 🔰 OBJETOS GLOBALES
//console.log(window) // ❌ En Node, no existe el objeto global `window`
console.log(typeof window) // undefined

//🔹 Objeto global para node
console.log(global)

//🔹 Objeto global que apunta a `global` y `window` (recomendado)
console.log(globalThis)

//window.console.log('Desde window') // ⚠️ En Node no funcionaría pero en el navegador sí
global.console.log('Desde global') // ⚠️ En Node funciona pero en el navegador no
globalThis.console.log('Desde globalThis') // ✔️ Funcionaría para casos (⭐ Recomendado)


/*

function sum(a, b) {
  return a + b
}

//🔹 CommonJS
module.exports = sum //🔹 Exporta la función y pueden renombrarlo
const mySum = require('./path/file')

module.exports = { sum } //🔹 Para obligar a que usen el nombre de la función
const { sum } = require('./path/file')

//🔹 ES Modules (⭐ Recomendado)
export default sum //🔹 Exporta la función y pueden renombrarlo
import mySum from './path/file'

export { sum } //🔹 Para obligar a que usen el nombre de la función
import { sum } from './path/file'

*/