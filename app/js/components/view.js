import Card from './card.js'
import { compare } from '../utilities.js'

export default class View {
  constructor(id, list, filter, sortOrders) {
    this.holder = document.querySelector(id)
    this.list = list
    this.filter = filter
    this.sortOrders = sortOrders

    this.list = this.applyFilter()
    this.applySorts()
    // this.data = this.list.map((item) => new Card(item).render())
  }

  applySorts() {
    // if both has no sort order return
    if (this.sortOrders.priority === 0 && this.sortOrders.date === 0) return
    if (this.sortOrders.date === 0) {
      // if priority has sort order
      this.list.sort(compare.priority)
      if (this.sortOrders.priority === 1) return
      // reverse only if sort order is ascending
      return this.list.reverse()
    }

    this.list.sort(compare.date)
    if (this.sortOrders.date === 1) return
    // reverse only if sort order is ascending
    this.list.reverse()
  }

  applyFilter() {
    if (this.filter === 'favorites') return this.list.filter((entry) => entry.favorite)
    if (this.filter === 'watched') return this.list.filter((entry) => entry.watched)
    return this.list
  }

  render() {
    this.holder.innerHTML = `
      ${
        this.list.length > 0
          ? `<div class="view">
              ${this.list.map((item) => new Card(item).render()).join('')}
            </div>`
          : `<div class="placeholder no-data">
              <div class="message">Nothing but the Void</div>
            </div>`
      }      
    `
  }
}
