const { BrowserWindow } = require('electron')

function createMain() {
  const win = new BrowserWindow({
    width: 1360,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('./app/main.html')
  return win
}

function createModal(parent) {
  const win = new BrowserWindow({
    width: 600,
    height: 300,
    parent,
    modal: true, // this is causing a flickering issue
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('./app/modal.html')

  win.once('ready-to-show', () => {
    win.show()
  }) 

  return win
}

module.exports = {
  createMain,
  createModal
}
