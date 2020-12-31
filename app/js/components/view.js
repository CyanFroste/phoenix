import Card from './card.js'

export default class View {
  constructor(id, list) {
    this.holder = document.querySelector(id)
    this.data = list.map((item) => new Card(item).render())
  }
  render() {
    this.holder.innerHTML = `
      <div class="view">
        ${this.data.join('')}
      </div>
    `
  }
}
