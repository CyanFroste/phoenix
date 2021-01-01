import { icon } from '../utilities.js'
const { remote } = require('electron')

export default class Titlebar {
  constructor(title) {
    this.title = title
    this.titlebar = document.createElement('header')
    this.titlebar.setAttribute('id', 'title-bar')
    document.body.prepend(this.titlebar)
    this.render()
    this.attachListeners()
  }

  attachListeners() {
    this.titlebar
      .querySelector('.close')
      .addEventListener('click', () => remote.getCurrentWindow().close())
  }

  render() {
    this.titlebar.innerHTML = `
      <div id="draggable">
        <div class="title">${icon('logo', 24)}${this.title}</div>
      </div>
      <div class="controls">
        <button class="close" type="button">${icon('close', 20)}</button>
      </div>
    `
  }
}
