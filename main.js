const { app, BrowserWindow, ipcMain } = require('electron')
const { createMain, createPrompt, createPreview } = require('./windows')
const { bookmark, favorite, unbookmark, watched, prioritize } = require('./api/anime')
const bookmarks = require('./api/bookmarks')

// window instances
/** @type {BrowserWindow} */
let main
/** @type {BrowserWindow} */
let prompt
/** @type {BrowserWindow} */
let preview

app.whenReady().then(() => {
  bookmarks.init()
  main = createMain()
})

// handlers
ipcMain.handle('data', bookmarks.read)
ipcMain.handle('reload', (e) => e.sender.reload())

// bookmark anime
ipcMain.handle('anime:add', async (e, id) => await bookmark(id))
// unbookmark anime
ipcMain.handle('anime:remove', async (e, id) => await unbookmark(id))
// mark anime as favorite
ipcMain.handle('anime:fav', async (e, id, value) => await favorite(id, value))
// mark anime as watched
ipcMain.handle('anime:watched', async (e, id, value) => await watched(id, value))
// change priority of anime
ipcMain.handle('anime:priority', async (e, id, priority) => await prioritize(id, priority))

// prompt
let options
let operation = async (type) => {
  if (type === 'remove') await unbookmark(options.item.id)
}

ipcMain.handle('prompt:open', async (e, data) => {
  options = data
  prompt = createPrompt(main)
})

// request options passed from main window from the prompt window
ipcMain.handle('prompt:options', (e) => options)

// send the choice when prompt window is closed
ipcMain.handle('prompt:choice', async (e, choice) => {
  if (choice) {
    await operation(options.operation)
    // re render the parent window
    prompt.getParentWindow().webContents.send('render')
  }
  // prompt is also closed when choice is returned
  prompt = null
})

// preview
let previewData

ipcMain.handle('preview:open', async (e, data) => {
  previewData = data
  createPreview()
})

ipcMain.handle('preview:data', async (e) => previewData)

// test
ipcMain.handle('test', () => console.log('faggoty faggoty faggoty fag'))
// `quit` app unless it's macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
// render `main` when the app is active and there are no other windows
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) main = createMain()
})
