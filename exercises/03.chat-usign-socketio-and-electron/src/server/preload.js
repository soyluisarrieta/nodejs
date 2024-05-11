window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if(element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.version[type])
  }

  // Verifica si estamos en el entorno de Electron
  if (window.process && window.process.type === 'renderer') {
    document.getElementById('titleBar').style.display = 'flex';
  }
})