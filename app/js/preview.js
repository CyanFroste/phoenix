const { ipcRenderer, remote, shell } = require('electron')
import Preview from './components/preview.js'
import Titlebar from './components/titlebar.js'

const previewContainer = document.getElementById('preview')

// states
let data

window.addEventListener('load', async () => {
  new Titlebar('phoenix')
  await render()

  document.querySelector('.url').addEventListener('click', (e) => {
    e.preventDefault()
    shell.openExternal(e.target.href)
  })
})

async function render({ refetch = true } = {}) {
  if (refetch) data = await ipcRenderer.invoke('preview:data')
  // render preview
  new Preview(previewContainer, data).render()
}
