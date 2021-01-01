const { ipcRenderer, remote } = require('electron')
import Modal from './components/modal.js'

window.addEventListener('load', async () => {
  const options = await ipcRenderer.invoke('modal:options')
  const response = async (choice) => {
    await ipcRenderer.invoke('modal:close', choice)
    remote.getCurrentWindow().close()
  }
  // render modal prompt
  new Modal('#modal', options).render()

  document.getElementById('ok').addEventListener('click', async () => await response(true))
  document.getElementById('cancel').addEventListener('click', async () => await response(false))
})
