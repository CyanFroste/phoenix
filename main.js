const { app, BrowserWindow, ipcMain } = require('electron')
const { createMain, createModal } = require('./windows')
const { read } = require('./api/file')
const { bookmark, favorite, unbookmark, watched } = require('./api/anilist')

// window instances
/** @type {BrowserWindow} */
let main
/** @type {BrowserWindow} */
let modal

app.whenReady().then(() => {
  main = createMain()
})

// handlers
// send data - called initially and on every window reload
ipcMain.handle('data', read)
ipcMain.handle('reload', (e) => {
  e.sender.reload()
})

// bookmark anime
ipcMain.handle('anime:add', async (e, id) => {
  await bookmark(id)
})
// unbookmark anime
ipcMain.handle('anime:remove', async (e, id) => {
  await unbookmark(id)
})
// mark anime as favorite
ipcMain.handle('anime:fav', async (e, id) => {
  await favorite(id)
})
// mark anime as watched
ipcMain.handle('anime:watched', async (e, id) => {
  await watched(id)
})

// modal
let options
let operation = async (type) => {
  switch (type) {
    case 'remove':
      await unbookmark(options.item.id)
      break
    default:
      break
  }
}

// request options passed from main window from the modal window
ipcMain.handle('modal:options', (e) => {
  return options
})
// send the choice when modal window is closed
ipcMain.handle('modal:close', async (e, choice) => {
  if (choice) {
    await operation(options.operation)
    // re render the parent window
    modal.getParentWindow().webContents.send('render')
  }
})

ipcMain.handle('modal:open', async (e, data) => {
  options = data
  modal = createModal(main)
})

//
ipcMain.handle('test', () => {
  console.log('faggoty faggoty faggoty fag')
})
// `quit` app unless it's macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// render `main` when the app is active and there are no other windows
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMain()
  }
})
