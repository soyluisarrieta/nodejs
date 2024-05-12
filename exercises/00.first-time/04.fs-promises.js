const fs = require('node:fs/promises')

// 🔰 Leer archivos de forma Asíncrona con promesas
console.log('⌛ Leyendo el Primer Archivo:');
fs.readFile('./archivo.txt', 'utf-8')
  .then(text => {
    console.log('✅ Primer archivo leído (asincrónicamente) =>', text); // Hello World!
  })


console.log('♻️ Haciendo cosas mientras lee el archivo...');


console.log('⌛ Leyendo el Segundo Archivo...');
fs.readFile('./archivo2.txt', 'utf-8')
  .then(text => {
    console.log('✅ Segundo archivo leído (asincrónicamente) =>', text); // Hello World!
  })

  
console.log('♻️ Sigo haciendo otras cosas mientras lee el archivo...');
console.log('🤓 Aquí finalizaría de leer el código.');