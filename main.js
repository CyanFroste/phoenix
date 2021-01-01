const { app, BrowserWindow, ipcMain } = require('electron')
const { createMain, createPrompt } = require('./windows')
const { read } = require('./api/file')
const { bookmark, favorite, unbookmark, watched, prioritize } = require('./api/anilist')

// window instances
/** @type {BrowserWindow} */
let main
/** @type {BrowserWindow} */
let prompt

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
ipcMain.handle('anime:fav', async (e, id, value) => {
  await favorite(id, value)
})
// mark anime as watched
ipcMain.handle('anime:watched', async (e, id, value) => {
  await watched(id, value)
})
// change priority of anime
ipcMain.handle('anime:priority', async (e, id, priority) => {
  await prioritize(id, priority)
})

// prompt
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

// request options passed from main window from the prompt window
ipcMain.handle('prompt:options', (e) => {
  return options
})
// send the choice when prompt window is closed
ipcMain.handle('prompt:close', async (e, choice) => {
  if (choice) {
    await operation(options.operation)
    // re render the parent window
    prompt.getParentWindow().webContents.send('render')
  }
})

ipcMain.handle('prompt:open', async (e, data) => {
  options = data
  prompt = createPrompt(main)
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
