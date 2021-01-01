export default class Prompt {
  constructor(id, options) {
    this.prompt = document.querySelector(id)
    this.options = options
  }
  render() {
    this.prompt.innerHTML = `
      <h1 class="title">${this.options.title}</h1>
      <div class="message">${this.options.message}</div>      
      <div class="controls"> 
        <button id="ok">${this.options.ok}</button>
        <button id="cancel">${this.options.cancel}</button>
      </div>
    `
  }
}
