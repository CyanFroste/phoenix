export default class Preview {
  constructor(container, data) {
    this.container = container
    this.data = data
  }

  formatEpisode() {
    if (!this.data.episodes) return 'ongoing'
    return this.data.episodes === 1
      ? `${this.data.episodes} episode`
      : `${this.data.episodes} episodes`
  }

  render() {
    this.container.innerHTML = `      
      <section class="content">
        <img src=${this.data.banner} alt="banner"/>
        <div class="details">
          <section class="left">
            <img src=${this.data.cover.image} alt=""/>
            <a class="url" href=${this.data.url}>@Anilist | ${this.data.id}</a>                     
          </section>
          <section class="right">
            <div class="name">${this.data.title}</div>        
            <div class="episodes">${this.data.format} | ${this.formatEpisode()}</div>
            <div class="description">
              <p>${this.data.description}</p>
            </div> 
            <div class="genres">
              ${this.data.genres.map((item) => `<span>${item}</span>`).join('')}
            </div>
            <div class="tags">
              ${this.data.tags.map((item) => `<span>${item}</span>`).join('')}
            </div>           
          </section>
        </div>
      </section>
    `
  }
}
