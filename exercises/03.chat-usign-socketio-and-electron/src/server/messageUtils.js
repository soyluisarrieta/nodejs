const fs = require('fs');
const { app } = require('electron');
const path = require('path');

// Rutas de los archivos de datos
const userDataPath = app.getPath('userData');
const getMessageFilePath = (port) => path.join(userDataPath, `Partitions/${port}/messages.json`);

// Función para guardar un mensaje en el archivo JSON
function saveMessage(message, port) {
  let messages = [];
  const messageFilePath = getMessageFilePath(port)
  try {
    const data = fs.readFileSync(messageFilePath, 'utf8');
    messages = JSON.parse(data);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error reading messages file:', err);
    }
  }
  messages.push({ id: messages.length + 1, message });
  fs.writeFileSync(messageFilePath, JSON.stringify(messages, null, 2), 'utf8');
}

// Función para obtener todos los mensajes del archivo JSON
function getAllMessages(port) {
  const messageFilePath = getMessageFilePath(port)
  try {
    if (!fs.existsSync(messageFilePath)) {
      fs.writeFileSync(messageFilePath, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(messageFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading messages file:', err);
    return [];
  }
}

module.exports = { saveMessage, getAllMessages };
