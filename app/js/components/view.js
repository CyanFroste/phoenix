import Card from './card.js'
import { compare } from '../utilities.js'

export default class View {
  constructor(holder, list, filter, sortOrders) {
    this.holder = holder
    this.list = list
    this.filter = filter
    this.sortOrders = sortOrders
    this.list = this.applyFilter()
    this.applySorts()
  }

  applySorts() {
    const { priority, date } = this.sortOrders
    // if both has no sort order sort by desc order of date as it's the natural order of the list
    if (priority === 0 && date === 0) return this.list.sort(compare.date)
    if (date === 0) {
      // if priority has sort order
      this.list.sort(compare.priority)
      if (priority === 1) return
      // reverse only if sort order is ascending
      return this.list.reverse()
    }

    this.list.sort(compare.date)
    if (date === 1) return
    // reverse only if sort order is ascending
    this.list.reverse()
  }

  applyFilter() {
    if (this.filter === 'favorites') return this.list.filter((entry) => entry.favorite)
    if (this.filter === 'watched') return this.list.filter((entry) => entry.watched)
    if (this.filter === 'not watched') return this.list.filter((entry) => !entry.watched)
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
