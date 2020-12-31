const { ipcRenderer } = require('electron')
import Add from './components/add.js'
import View from './components/view.js'
import { composeOptions, capitalize } from './utilities.js'

const error = document.getElementById('error')
const title = document.getElementById('title')

//  data
let data
let filter = 'bookmarks'

// add component
let add = new Add('.add')

// server driven render
ipcRenderer.on('render', async () => await render())

document.querySelectorAll('.filter').forEach((btn) =>
  btn.addEventListener('click', async (e) => {
    filter = btn.id
    await render()
  })
)

async function render() {
  // get data
  data = await ipcRenderer.invoke('data')
  // render views
  // conditionally based on filter
  let list = data.bookmarks
  if (filter === 'favorites') list = data.bookmarks.filter((entry) => entry.favorite)
  if (filter === 'watched') list = data.bookmarks.filter((entry) => entry.watched)
  new View('.view-holder', list).render()

  // render title
  title.innerHTML = capitalize(filter)
  if (filter === 'bookmarks') add.render()
  else add.unmount()

  // attach event listeners
  attachEventListeners()
}

function attachEventListeners() {
  // add listeners to all fav buttons
  document.querySelectorAll('.fav').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      try {
        await ipcRenderer.invoke('anime:fav', btn.closest('.card').id)
        await render()
      } catch (err) {
        error.innerHTML = err.message
      }
    })
  )
  // add listeners to all status buttons
  document.querySelectorAll('.status').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      try {
        await ipcRenderer.invoke('anime:watched', btn.closest('.card').id)
        await render()
      } catch (err) {
        error.innerHTML = err.message
      }
    })
  )
  // add listeners to all remove buttons
  document.querySelectorAll('.remove').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      try {
        const item = data.bookmarks.find((entry) => entry.id === +btn.closest('.card').id)
        await ipcRenderer.invoke('modal:open', composeOptions('remove', item))
      } catch (err) {
        error.innerHTML = err.message
      }
    })
  )

  // conditionally add listener to the add bookmark
  if (filter === 'bookmarks')
    document.getElementById('add').addEventListener('click', async (e) => {
      const id = document.getElementById('anime-id').value
      try {
        await ipcRenderer.invoke('anime:add', id)
        await render()
      } catch (err) {
        error.innerHTML = err.message
      }
    })
}

window.addEventListener('load', async () => {
  await render()
})
