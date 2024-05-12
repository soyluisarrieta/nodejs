# Mis notas sobre Nodejs

Curso: [Aprendiendo React](https://youtube.com/playlist?list=PLUofhDIg_38qm2oPOV-IRTTEKyrVBBaU7&si=wPEb5EE66u7YVifk)  
Autor del curso: [Miguel Angel Durán](https://github.com/midudev)

## Acerca de

### ¿Qué es Node.js?

[Nodejs](https://nodejs.org/) es como un "superpoder" para JavaScript. Permite ejecutar este lenguaje no solo en navegadores, sino también en el servidor, la terminal e incluso en dispositivos como la Nintendo Switch.

Es gratis, funciona en todas las plataformas (Windows, Mac, Linux, etc.), y su forma de trabajar (asíncrona) lo hace muy rápido. Todo esto lo hace posible el motor [V8](#v8), el mismo que usa Google Chrome.

### V8

Es el motor de JavaScript desarrollador por Google y utilizado en Chrome, lo que ha permitido que el lenguaje mejore y evolucione, aumentando significativamente la velocidad de ejecución.

### ¿Por qué aprenderlo?

1. Existe una gran demanda en el mercado laboral.
2. Los desarrolladores de JavaScript se familiarizan fácilmente con su sintaxis.
3. Permite crear una amplia variedad de aplicaciones, como web, de escritorio, APIs, scrapers, servicios y utilidades.
4. Cuenta con una gran comunidad de desarrolladores.
5. Node.js cuenta con el ecosistema de paquetes más grande del mundo a través de NPM.
6. Es rápido, escalable, económico y fácil de desplegar.

### Historia

Node.js fue creado en 2009 por [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl). Él estaba frustrado con las limitaciones de los servidores web tradicionales (Apache HTTP Server), así que decidió construir uno nuevo que pudiera manejar muchas conexiones al mismo tiempo.

## Formas de instalar

En la página oficial de [Nodejs](https://nodejs.org/en/download) hay dos versiones:

> [!NOTE]
> Aún no descargues ni instales nada hasta leer toda la sección.

![Nodejs Downloads versions](nodejs-downloads.png)

|LST (Recomendada)|Current|
|-|-|
|Significa Soporte a largo plazo (*Long Term Support*) es la versión más estable y que siempre están actualizando.|Cuenta con las últimas caracteristicas y funcionalidades nuevas pero que aún se consideran inestables.|

La desventaja de instalarlo de esta forma es que solo implementará una única versión en el ordenador. Con [NVM](https://github.com/nvm-sh/nvm) (*Node.js Version Manager*) es posible administrar distintas versiones de node.

Una mejor alternativa a NVM es [FNM](https://github.com/Schniz/fnm) (*Fast Node.js manager*) - Gestor de versiones de Node.js rápido y sencillo construído en Rust.

## Instalaciones

1. **[Rust](https://www.rust-lang.org/es/tools/install):** Para instalar FNM es requerido tener instalado Rust, desgargue RUSTUP-INIT.EXE dependiendo de la arquitectura de bits del ordenador. Para asegurarte de que ya está instalado:

    ```bash
    rustc --version
    ```

2. **[FNM](https://github.com/Schniz/fnm):** Para instalarlo en Windows desde la terminal:

    ```bash
    winget install Schniz.fnm
    ```

    Reinicie la terminal y asegurese de tener instalado FNM:

    ```bash
    fnm --version
    ```

3. **[NodeJS](https://nodejs.org/en/download):** Primero selecciona la versión de Node que deseas instalar y usa FNM:

    ```bash
    # Instalar la versión LTS actual
    fnm install --lts

    # O puede especificar una versión
    fnm install 20.13.1
    ```

    Asegurese de haber instalado node en su versión correspondiente:

    ```bash
    fnm list
    ```

    En caso de tener varias versiones y desea usar una versión instalada:

    ```bash
    fnm use 20.13.1
    ```

    Finalmente, para asegurarse de la versión definida:

    ```bash
    node --version
    ```

Mientras hacia todo el proceso, tuve problemas al momento de usar una versión, únicamente tuve que ejecutar este comando en power shell:

```bash
fnm env --use-on-cd | Out-String | Invoke-Expression
```

## Primero pasos

Con NodeJS puede ejecutar la linea de comando [REPL](https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl) (*Read Evaluate Print Loop*) para iniciar el entorno de desarrollo en la terminal:

```bash
node
```

Esto permitirá que pueda ejecutar código de node similar a la consola del navegador, por ejemplo un **Hola mundo**

```bash
const a = 'Hola mundo'
```

```bash
console.log(a)
```

Puedes ejecutar instrucciones matemáticas:

```bash
2 + 2
```

En lugar de usar REPL, puedes ejecutar un archivo js. En la carpeta `./exercices/00.first-time/` se encuentra un index.js que contiene lo siguiente:

### Impresiones

```js
//🔹 El console log, info y error se muestran igual en la consola
console.log('Hello world1!')
console.info('Hello world2!')
console.error('Hello world3!')
```

### Objetos globales

```js
console.log(window) // ❌ En Node, no existe el objeto global `window`
console.log(typeof window) // undefined

//🔹 Objeto global para node
console.log(global)

//🔹 Objeto global que apunta a `global` y `window` (recomendado)
console.log(globalThis)

window.console.log('Desde window') // ⚠️ En Node no funcionaría pero en el navegador sí
global.console.log('Desde global') // ⚠️ En Node funciona pero en el navegador no
globalThis.console.log('Desde globalThis') // ✔️ Funcionaría para casos (⭐ Recomendado)
```

## Patrón de diseño módulo

### CommonJS

- **Exportar una función para usarla en otros archivos**

    ```js
    // Ejemplo 1
    function sum(a, b) { return a + b }

    //🔹 Exporta la función por defecto y pueden renombrarlo
    module.exports = sum
    ```

    ```js
    // Ejemplo 2
    function sum(a, b) { return a + b }

    //🔹 Para obligar a que usen el nombre de la función
    module.exports = { sum }
    ```

- **Importar la función desde otro archivo**

    ```js
    // Ejemplo 1
    const mySum = require('./path/sumFile')
    console.log(mySum(2,3)) // 5
    ```

    ```js
    // Ejemplo 2
    const { sum } = require('./path/sumFile')
    console.log(sum(7,3)) // 10
    ```

### ES Modules (⭐)

- **Exportar una función para usarla en otros archivos**

    ```js
    // Ejemplo 1
    function sum(a, b) { return a + b }

    //🔹 Exporta la función por defecto y pueden renombrarlo
    export default sum
    ```

    ```js
    // Ejemplo 2
    function sum(a, b) { return a + b }

    //🔹 Para obligar a que usen el nombre de la función
    export { sum }
    ```

- **Importar la función desde otro archivo**

    ```js
    // Ejemplo 1
    import mySum from './path/file'
    console.log(mySum(2,3)) // 5
    ```

    ```js
    // Ejemplo 2
    import { sum } from './path/file'
    console.log(sum(7,3)) // 10
    ```

Para ejecutar el archivo, abre la terminal en la ubicación del script y ejecuta:

```bash
node index.js
```

### Extensiones

Node permite ejecutar script de JavaScript en diferentes extensiones:

|.js|.cjs|.mjs|
|-|-|-|
|Por defecto usa el patrón de diseño CommonJS|Forza a usar el patrón de diseño CommonJS|Forza a usar el patrón de diseño ES Modules|

## Módulos nativos de NodeJS

Al momento de importar un módulo de Node es posible hacerlo de la siguiente forma:

```js
const os = require('os') // ⚠️
const os = require('node:os') // ✅
```

>[!WARNING]
Pero a partir de la versión 16 de Node, ya no es recomendable importar los módulos directamente del módulo nativo. Lo recomendable es usar el prefijo de node.

### Operating System

```js
const os = require('node:os') // (⭐)

console.log('Información del sistema operativo');
console.log('---');

console.log('Sistema Operativos:',os.platform());
console.log('Versión:',os.release());
console.log('Arquitectura:',os.arch());
console.log('CPUs:',os.cpus());
console.log('Memoria libre:',os.freemem() / 1024 / 1024,'MB');
console.log('Memoria total:',os.totalmem() / 1024 / 1024,'MB');
console.log('Tiempo encendido:',os.uptime()/60/60,'horas');
```

Este mismo ejemplo en ES Module quedaría de la siguiente manera:

```js
import { platform, release, arch, cpus, freemem, totalmem, uptime } from 'node:os';

console.log('Información del sistema operativo');
console.log('---');

console.log('Sistema Operativos:',platform());
console.log('Versión:',release());
console.log('Arquitectura:',arch());
console.log('CPUs:',cpus());
console.log('Memoria libre:',freemem() / 1024 / 1024,'MB');
console.log('Memoria total:',totalmem() / 1024 / 1024,'MB');
console.log('Tiempo encendido:',uptime()/60/60,'horas');
```

### File System

1. Ver estadísticas de un archivo:

    ```js
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
    ```

2. Leer el contenido de un archivo (utf-8, sync, callbacks, promises):

    1. UTF-8:

        ```js
        const fs = require('node:fs')

        const text1 = fs.readFileSync('./archivo.txt')
        console.log(text1); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64 21>

        const text2 = fs.readFileSync('./archivo.txt', 'utf-8')
        console.log(text2); // Hello World!
        ```

    2. Leer archivos de forma Síncrona:

        ```js
        console.log('⌛ Leyendo el Primer Archivo...');
        const text3 = fs.readFileSync('./archivo.txt', 'utf-8')
        console.log('✅ Primer archivo leído (sincrónicamente) =>', text3); // Hello World!

        console.log('⌛ Leyendo el Segundo Archivo...');
        const text4 = fs.readFileSync('./archivo.txt', 'utf-8')
        console.log('✅ Segundo archivo leído (sincrónicamente) =>', text4); // Hello World!

        ```

    3. Leer archivos de forma Asíncrona con Callback:

        ```js
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
        ```

    4. Leer archivos de forma Asíncrona con promesas:

        ```js
        const fs = require('node:fs/promises')

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
        ```

    5. Leer archivos de forma Asíncrona con Async/Await:

        ```js
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
        ```

    6. Leer archivos de forma Asíncrona paralelamente:

        ```js
        const { readFile } = require('node:fs/promises')

        Promise.all([
          readFile('./archivo.txt', 'utf-8'),
          readFile('./archivo2.txt', 'utf-8')
        ]).then(([text1, text2]) => {
          console.log('✅ Primer archivo leído (asincrónicamente) =>', text1);
          console.log('✅ Segundo archivo leído (asincrónicamente) =>', text2);
        })
        ```
