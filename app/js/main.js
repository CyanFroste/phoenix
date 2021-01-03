const { ipcRenderer } = require('electron')
import Add from './components/add.js'
import View from './components/view.js'
import Err from './components/error.js'
import { composeOptions, capitalize } from './utilities.js'
import { sortPriority, sortDate } from './components/buttons.js'
import Titlebar from './components/titlebar.js'

const toast = document.getElementById('toast')
const titleSpace = document.getElementById('title')
const sorter = document.getElementById('sorter')
const viewHolder = document.getElementById('view-holder')
const addContainer = document.querySelector('.add')

//  states
let data
let filter = 'bookmarks'
let adding = false

// sort orders
let date = 1 // 1 = desc' : latest to last
let priority = 0 // 2 = 'asc' : high to low, 0 = 'no order'

// add component
let add = new Add(addContainer)

window.addEventListener('load', async () => {
  new Titlebar('phoenix')
  await render()

  // server driven render
  ipcRenderer.on('render', async () => await render())

  document.querySelectorAll('.filter').forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      filter = btn.id
      /* no need to refetch data as any operation done on the entry will have
        previously refetched the data to reflect the changes */
      await render({
        refetch: false,
        sortBtns: false
      })
    })
  )
})

async function render({
  refetch = true,
  view = true,
  title = true,
  sortBtns = true,
  adder = true
} = {}) {
  // get data
  if (refetch) data = await ipcRenderer.invoke('data')
  // render view
  if (view) new View(viewHolder, data.bookmarks, filter, { priority, date }).render()

  // render `add` when bookmarks is selected else unmount / clear
  if (adder)
    if (filter === 'bookmarks') add.render()
    else add.unmount()

  // render title
  if (title) titleSpace.innerHTML = capitalize(filter)
  // render sorter
  if (sortBtns) sorter.innerHTML = sortPriority(priority) + sortDate(date)

  // attach event listeners
  attachEventListeners(view, sortBtns, adder)
}

function attachEventListeners(view, sortBtns, adder) {
  // add / re-add listeners on view if view is re-rendered
  if (view) {
    // add listeners to all preview buttons
    document.querySelectorAll('.card .preview').forEach((btn) =>
      btn.addEventListener('click', async (e) => {
        try {
          const item = data.bookmarks.find((entry) => entry.id === +btn.closest('.card').id)
          await ipcRenderer.invoke('preview:open', item)
        } catch (err) {
          new Err(toast, err.message, 2000)
        }
      })
    )

    // add listeners to all fav buttons
    document.querySelectorAll('.card .fav').forEach((btn) =>
      btn.addEventListener('click', async (e) => {
        try {
          const item = data.bookmarks.find((entry) => entry.id === +btn.closest('.card').id)
          await ipcRenderer.invoke('anime:fav', item.id, !item.favorite)
          await render({
            title: false,
            sortBtns: false,
            adder: false
          })
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
          await render({
            title: false,
            sortBtns: false,
            adder: false
          })
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
          await render({
            title: false,
            sortBtns: false,
            adder: false
          })
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
  }

  // add / re-add sort button listeners if they are re-rendered
  if (sortBtns) {
    // add listeners to sorter buttons
    document.querySelector('.sort-priority').addEventListener('click', async () => {
      priority = (priority + 1) % 3
      if (priority !== 0) date = 0
      await render({
        refetch: false,
        title: false,
        adder: false
      })
    })
    document.querySelector('.sort-date').addEventListener('click', async () => {
      date = (date + 1) % 3
      if (date !== 0) priority = 0
      await render({
        refetch: false,
        title: false,
        adder: false
      })
    })
  }

  // listener for `add`
  const addBookmark = async (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter') return
    if (adding) return new Err(toast, 'Specified anime is being added', 2000)
    const id = document.getElementById('anime-id')
    try {
      adding = true
      await ipcRenderer.invoke('anime:add', id.value)
      adding = false
      await render({
        title: false,
        sortBtns: false,
        adder: false
      })
    } catch (err) {
      adding = false
      new Err(toast, err.message, 2000)
    }
  }

  // add / re-add listener to `add` if it's re-rendered
  if (adder)
    if (filter === 'bookmarks') {
      // conditionally add listener to `add`
      document.getElementById('anime-id').addEventListener('keydown', addBookmark)
      document.getElementById('add').addEventListener('click', addBookmark)
    }
}
