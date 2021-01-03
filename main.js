const { app, BrowserWindow, ipcMain } = require('electron')
const { createMain, createPrompt, createPreview } = require('./windows')
const { bookmark, favorite, unbookmark, watched, prioritize } = require('./api/anime')
const bookmarks = require('./api/bookmarks')

// window instances
/** @type {BrowserWindow} */
let main
/** @type {BrowserWindow} */
let prompt

app.whenReady().then(() => {
  bookmarks.init() // Note! this uses asynchronous code, can possibly not initialize before creating window
  main = createMain()
})

// HANDLERS
// send bookmarks data to renderer
ipcMain.handle('data', bookmarks.read)
// reload on renderer request
ipcMain.handle('reload', (e) => e.sender.reload())

// bookmark anime
ipcMain.handle('anime:add', async (_, id) => await bookmark(id))
// unbookmark anime
ipcMain.handle('anime:remove', async (_, id) => await unbookmark(id))
// mark anime as favorite
ipcMain.handle('anime:fav', async (_, id, value) => await favorite(id, value))
// mark anime as watched
ipcMain.handle('anime:watched', async (_, id, value) => await watched(id, value))
// change priority of anime
ipcMain.handle('anime:priority', async (_, id, priority) => await prioritize(id, priority))

// PROMPT ACTIONS
// STATE
let options
// prompt operations
let operation = async (type) => {
  if (type === 'remove') await unbookmark(options.item.id)
}
ipcMain.handle('prompt:open', async (_, data) => {
  // save options data from caller window to state, then create prompt and pass that data on request
  options = data
  prompt = createPrompt(main)
})
// request options passed from main window from the prompt window
ipcMain.handle('prompt:options', () => options)
// send the choice when prompt window is closed
ipcMain.handle('prompt:choice', async (_, choice) => {
  if (choice) {
    await operation(options.operation)
    // re-render the parent window
    prompt.getParentWindow().webContents.send('render')
  }
  // prompt is also closed when choice is returned
  prompt = null
})

// PREVIEW ACTIONS
// STATE
let previewData
ipcMain.handle('preview:open', async (_, data) => {
  previewData = data
  createPreview()
})
ipcMain.handle('preview:data', async () => previewData)

// TEST HANDLE
ipcMain.handle('test', () => console.log('faggoty faggoty faggoty fag'))
// `quit` app unless it's macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
// render `main` when the app is active and there are no other windows
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) main = createMain()
})
