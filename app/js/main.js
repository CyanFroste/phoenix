const { ipcRenderer } = require('electron')
import Add from './components/add.js'
import View from './components/view.js'
import Err from './components/error.js'
import { composeOptions, capitalize } from './utilities.js'
import { sortPriority, sortDate } from './components/buttons.js'
import Titlebar from './components/titlebar.js'

const toast = document.getElementById('toast')
const title = document.getElementById('title')
const sorter = document.getElementById('sorter')

//  states
let data
let filter = 'bookmarks'
let adding = false

// sort orders
let date = 0 // 1 = desc' : latest to last
let priority = 1 // 2 = 'asc' : high to low, 0 = 'no order'

// add component
let add = new Add('.add')

window.addEventListener('load', async () => {
  new Titlebar('phoenix')
  await render()

  // server driven render
  ipcRenderer.on('render', async () => await render())

  document.querySelectorAll('.filter').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      filter = btn.id
      await render()
    })
  )
})

async function render() {
  // get data
  data = await ipcRenderer.invoke('data')
  // render views
  new View('.view-holder', data.bookmarks, filter, { priority, date }).render()

  // render title
  title.innerHTML = capitalize(filter)
  if (filter === 'bookmarks') add.render()
  else add.unmount()

  // render sorter
  sorter.innerHTML = sortPriority(priority) + sortDate(date)

  // attach event listeners
  attachEventListeners()
}

function attachEventListeners() {
  // add listeners to all fav buttons
  document.querySelectorAll('.card .fav').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      try {
        const item = data.bookmarks.find((entry) => entry.id === +btn.closest('.card').id)
        await ipcRenderer.invoke('anime:fav', item.id, !item.favorite)
        await render()
      } catch (err) {
        new Err(toast, err.message, 2000)
      }
    })
  )
  // add listeners to all status buttons
  document.querySelectorAll('.card .status').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      try {
        const item = data.bookmarks.find((entry) => entry.id === +btn.closest('.card').id)
        await ipcRenderer.invoke('anime:watched', item.id, !item.watched)
        await render()
      } catch (err) {
        new Err(toast, err.message, 2000)
      }
    })
  )
  // add listeners to all remove buttons
  document.querySelectorAll('.card .remove').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      try {
        const item = data.bookmarks.find((entry) => entry.id === +btn.closest('.card').id)
        await ipcRenderer.invoke('prompt:open', composeOptions('remove', item))
      } catch (err) {
        new Err(toast, err.message, 2000)
      }
    })
  )

  // add listeners to all priority toggle buttons
  document.querySelectorAll('.card .priority').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      try {
        const item = data.bookmarks.find((entry) => entry.id === +btn.closest('.card').id)
        await ipcRenderer.invoke('anime:priority', item.id, (item.priority + 1) % 3)
        await render()
      } catch (err) {
        new Err(toast, err.message, 2000)
      }
    })
  )

  // add listeners to sorter buttons
  document.querySelector('.sort-priority').addEventListener('click', async () => {
    priority = (priority + 1) % 3
    if (priority !== 0) date = 0
    await render()
  })
  document.querySelector('.sort-date').addEventListener('click', async () => {
    date = (date + 1) % 3
    if (date !== 0) priority = 0
    await render()
  })

  // conditionally add listener to the add bookmark
  if (filter === 'bookmarks')
    document.getElementById('add').addEventListener('click', async (e) => {
      if (adding) return new Err(toast, 'Specified anime is being added', 2000)
      const id = document.getElementById('anime-id')
      try {
        adding = true
        await ipcRenderer.invoke('anime:add', id.value)
        adding = false
        await render()
      } catch (err) {
        adding = false
        new Err(toast, err.message, 2000)
      }
    })
}
