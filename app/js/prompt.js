const { ipcRenderer, remote } = require('electron')
import Prompt from './components/prompt.js'

window.addEventListener('load', async () => {
  const options = await ipcRenderer.invoke('prompt:options')
  const response = async (choice) => {
    await ipcRenderer.invoke('prompt:close', choice)
    remote.getCurrentWindow().close()
  }
  // render prompt
  new Prompt('#prompt', options).render()

  document.getElementById('ok').addEventListener('click', async () => await response(true))
  document.getElementById('cancel').addEventListener('click', async () => await response(false))
})
