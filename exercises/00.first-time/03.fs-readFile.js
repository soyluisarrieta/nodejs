const fs = require('node:fs')

// 🔰 Leer archivos sin y con UTF-8
const text1 = fs.readFileSync('./archivo.txt')
console.log(text1); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64 21>

const text2 = fs.readFileSync('./archivo.txt', 'utf-8')
console.log(text2); // Hello World!


// 🔰 Leer archivos de forma Síncrona
console.log('⌛ Leyendo el Primer Archivo...');
const text3 = fs.readFileSync('./archivo.txt', 'utf-8')
console.log('✅ Primer archivo leído (sincrónicamente) =>', text3); // Hello World!


console.log('⌛ Leyendo el Segundo Archivo...');
const text4 = fs.readFileSync('./archivo.txt', 'utf-8')
console.log('✅ Segundo archivo leído (sincrónicamente) =>', text4); // Hello World!


// 🔰 Leer archivos de forma Asíncrona con Callback
console.log('⌛ Leyendo el Primer Archivo:');
fs.readFile('./archivo.txt', 'utf-8', (err, text) => {
  console.log('✅ Primer archivo leído (asincrónicamente) =>', text); // Hello World!
})


console.log('♻️ Haciendo cosas mientras lee el archivo...');

console.log('⌛ Leyendo el Segundo Archivo...');
fs.readFile('./archivo2.txt', 'utf-8', (err, text) => {
  console.log('✅ Segundo archivo leído (asincrónicamente) =>', text); // Hello World!
})

console.log('♻️ Sigo haciendo otras cosas mientras lee el archivo...');
console.log('🤓 Aquí finalizaría de leer el código.');