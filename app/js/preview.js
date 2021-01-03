const { ipcRenderer, shell } = require('electron')
import Preview from './components/preview.js'
import Titlebar from './components/titlebar.js'

const previewContainer = document.getElementById('preview')

//  states
/** @type {object} */
let data

window.addEventListener('load', async () => {
  // TODO: defined in `main`
  new Titlebar('phoenix')
  await render()

  // open link in default browser
  document.querySelector('.url').addEventListener('click', (e) => {
    e.preventDefault()
    shell.openExternal(e.target.href)
  })
})

async function render({ refetch = true } = {}) {
  if (refetch) data = await ipcRenderer.invoke('preview:data')
  // render preview
  // TODO: defined in `main`
  new Preview(previewContainer, data).render()
}
