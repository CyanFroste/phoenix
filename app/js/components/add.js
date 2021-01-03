import { icon } from '../utilities.js'

export default class Add {
  constructor(container) {
    this.container = container
  }
  render() {
    this.container.innerHTML = `
      <input type="text" name="id" id="anime-id" placeholder="Enter Anilist ID to add">
      <button id="add" type="button">${icon('add', 20)}</button>
    `
  }
  unmount() {
    this.container.innerHTML = null
  }
}
