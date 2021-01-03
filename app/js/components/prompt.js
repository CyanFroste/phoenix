export default class Prompt {
  constructor(container, options) {
    this.container = container
    this.options = options
  }
  render() {
    this.container.innerHTML = `
      <h1 class="title">${this.options.title}</h1>
      <div class="message">${this.options.message}</div>      
      <div class="controls"> 
        <button id="ok">${this.options.ok}</button>
        <button id="cancel">${this.options.cancel}</button>
      </div>
    `
  }
}
