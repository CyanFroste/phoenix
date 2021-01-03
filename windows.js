const { BrowserWindow } = require('electron')

function createMain() {
  const win = new BrowserWindow({
    width: 1270,
    height: 700,
    minWidth: 1270,
    minHeight: 700,
    frame: false,
    show: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })
  win.loadFile('./app/main.html')
  win.once('ready-to-show', () => {
    win.show()
  })
  // to remove menu
  win.removeMenu()
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
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })
  win.loadFile('./app/prompt.html')
  win.once('ready-to-show', () => {
    win.show()
  })
  // to remove menu
  win.removeMenu()
  return win
}

function createPreview() {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })
  win.loadFile('./app/preview.html')
  win.once('ready-to-show', () => {
    win.show()
  })
  // to remove menu
  win.removeMenu()
  // return win
}

module.exports = {
  createMain,
  createPrompt,
  createPreview
}
