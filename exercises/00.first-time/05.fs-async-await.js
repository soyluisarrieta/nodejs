const { readFile } = require('node:fs/promises')

// IIFE - Inmediatly Invoked Function Expression
;(
  async () => {
    console.log('⌛ Leyendo el Primer Archivo:');
    const text1 = await readFile('./archivo.txt', 'utf-8');
    console.log('✅ Primer archivo leído (asincrónicamente) =>', text1); // Hello World!

    console.log('♻️ Haciendo cosas mientras lee el archivo...');

    console.log('⌛ Leyendo el Segundo Archivo...');
    const text2 = await readFile('./archivo2.txt', 'utf-8');
    console.log('✅ Segundo archivo leído (asincrónicamente) =>', text2); // Hello World!
      
    console.log('♻️ Sigo haciendo otras cosas mientras lee el archivo...');
    console.log('🤓 Aquí finalizaría de leer el código.');
  }
)()