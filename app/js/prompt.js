const { ipcRenderer, remote } = require('electron')
import Prompt from './components/prompt.js'

const promptContainer = document.getElementById('prompt')

window.addEventListener('load', async () => {
  const options = await ipcRenderer.invoke('prompt:options')
  const response = async (choice) => {
    await ipcRenderer.invoke('prompt:choice', choice)
    remote.getCurrentWindow().close()
  }
  // render prompt
  new Prompt(promptContainer, options).render()

  document.getElementById('ok').addEventListener('click', async () => await response(true))
  document.getElementById('cancel').addEventListener('click', async () => await response(false))
})
