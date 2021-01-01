const { BrowserWindow } = require('electron')

function createMain() {
  const win = new BrowserWindow({
    width: 1270,
    height: 700,    
    minWidth: 1270,
    minHeight: 700,
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })
  win.loadFile('./app/main.html')
  return win
}

function createPrompt(parent) {
  const win = new BrowserWindow({
    width: 620,
    height: 220,
    parent,
    modal: true, // this is causing a flickering issue
    show: false,
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })
  win.loadFile('./app/prompt.html')

  win.once('ready-to-show', () => {
    win.show()
  }) 

  return win
}

module.exports = {
  createMain,
  createPrompt
}
