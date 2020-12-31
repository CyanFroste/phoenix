import { icon } from '../utilities.js'

export default class Card {
  constructor(item) {
    this.data = item
  }

  formatEpisode() {
    if (!this.data.episodes) return 'ongoing'
    return this.data.episodes === 1
      ? `${this.data.episodes} episode`
      : `${this.data.episodes} episodes`
  }

  fontColor() {
    /** @type {string} */
    let color = this.data.cover.color
    if (color.startsWith('#')) color = color.slice(1)
    const r = parseInt(color.substring(0, 2), 16)
    const g = parseInt(color.substring(2, 4), 16)
    const b = parseInt(color.substring(4, 6), 16)
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'font-dark' : 'font-light'
  }

  alphaHex(percent) {
    // optional
    percent = Math.max(0, Math.min(100, percent))
    const int = Math.round((percent / 100) * 255)
    const hex = int.toString(16)
    return hex.padStart(2, '0').toUpperCase()
  }

  render() {
    return `
      <div 
        class="card ${this.fontColor()}" 
        id=${this.data.id} 
        style="background-color: ${this.data.cover.color}"
      >
        <img src=${this.data.cover.image} />
        <div class="details">
          <div class="name">${this.data.title}</div>         
          <div class="episodes">${this.data.format} | ${this.formatEpisode()}</div>
          <div class="genres">
            ${this.data.genres.join(', ')}
          </div>
        </div>
        <div class="controls">
          <button type="button" class="remove">${icon('delete', 20)}</button>
          <button type="button" class="fav">${
            this.data.favorite ? icon('fav', 20) : icon('fav-stroke', 20)
          }</button>
          <button type="button" class="status">${
            this.data.watched ? icon('check', 20) : icon('bookmark', 20)
          }</button>
          <button type="button" class="source">${icon('link', 20)}</button>
        </div>
      </div>
    `
  }
}