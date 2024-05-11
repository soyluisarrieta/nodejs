const fs = require('fs');
const { app } = require('electron');
const path = require('path');

// Rutas de los archivos de datos
const userDataPath = app.getPath('userData');
const messagesFilePath = path.join(userDataPath, 'messages.json');

// Función para guardar un mensaje en el archivo JSON
function saveMessage(message) {
  let messages = [];
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    messages = JSON.parse(data);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error reading messages file:', err);
    }
  }
  messages.push({ id: messages.length + 1, message });
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
}

// Función para obtener todos los mensajes del archivo JSON
function getAllMessages() {
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading messages file:', err);
    return [];
  }
}

module.exports = { saveMessage, getAllMessages };
