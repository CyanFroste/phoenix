const { ipcRenderer } = require('electron')
import Modal from './components/modal.js'

window.addEventListener('load', async () => {
  const options = await ipcRenderer.invoke('modal:options')
  const response = async (choice) => {
    await ipcRenderer.invoke('modal:close', choice)
    window.close()
  }
  // render modal prompt
  console.log(options)
  new Modal('#modal', options).render()

  document.getElementById('ok').addEventListener('click', async () => await response(true))
  document.getElementById('cancel').addEventListener('click', async () => await response(false))

})
