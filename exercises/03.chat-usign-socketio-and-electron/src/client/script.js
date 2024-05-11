const { ipcRenderer } = require('electron')

const maxResBtn = document.getElementById('maxResBtn')

function changeMaxResBtn(isMaximizedApp) {
  if(isMaximizedApp) {
    maxResBtn.title = 'Restaurar'; 
    maxResBtn.textContent = 'o)'
  } else {
    maxResBtn.title = 'Maximizar'; 
    maxResBtn.textContent = 'O'
  }
}

maxResBtn.addEventListener('click', () => { ipcRenderer.send('maximizeRestoreApp') })
ipcRenderer.on('isMaximized', () => { changeMaxResBtn(true) })
ipcRenderer.on('isRestored', () => { changeMaxResBtn(false) })

minimizeBtn.addEventListener('click', () => { ipcRenderer.send('minimizeApp') })
closeBtn.addEventListener('click', () => { ipcRenderer.send('closeApp') })