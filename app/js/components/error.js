import { icon } from '../utilities.js'

/** @type {NodeJS.Timeout} error timer */
let timer

export default class Err {
  constructor(element, message, duration) {
    this.message = message
    this.container = element
    this.unmount()
    clearTimeout(timer)
    this.render()
    timer = setTimeout(() => this.unmount(), duration)
  }

  render() {
    this.container.innerHTML = `
      <div class="error">
        ${icon('error', 20)} ${this.parse()}      
      </div>
    `
  }

  parse() {
    return this.message.includes('message:')
      ? this.message.slice(this.message.indexOf('message:') + 8)
      : this.message
  }

  unmount() {
    this.container.querySelector('.error') && (this.container.innerHTML = '')
  }
}
