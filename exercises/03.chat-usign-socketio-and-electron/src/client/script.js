const { ipcRenderer } = require('electron')

closeBtn.addEventListener('click', ()=>{
  ipcRenderer.send('closeApp')
})

minimizeBtn.addEventListener('click', ()=>{
  ipcRenderer.send('minimizeApp')
})

maxResBtn.addEventListener('click', ()=>{
  ipcRenderer.send('maxResApp')
})