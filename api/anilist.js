const anilist = require('anilist-node')
const { exists, find, remove, append, modify } = require('./file')

const Anilist = new anilist()

/** @param {string|number} id */
async function bookmark(id) {
  if (exists(+id)) throw new Error('already exists')
  const res = await Anilist.media.anime(+id)
  if (!res.id) throw new Error('anime not found')
  return append({
    id: res.id,
    title: res.title.userPreferred,
    status: res.status,
    episodes: res.episodes,
    format: res.format,
    description: res.description,
    cover: { image: res.coverImage.small, color: res.coverImage.color },
    banner: res.bannerImage,
    genres: res.genres,
    tags: res.tags,
    related: res.relations,
    url: res.siteUrl,
    favorite: false,
    watched: false
  })
}

/** @param {string|number} id */
async function favorite(id) {
  if (!exists(+id)) throw new Error("doesn't exist")
  return modify(+id, { favorite: !find(+id).favorite })
}
/** @param {string|number} id */
async function watched(id) {
  if (!exists(+id)) throw new Error("doesn't exist")
  return modify(+id, { watched: !find(+id).watched })
}

/** @param {string|number} id */
async function unbookmark(id) {
  if (!exists(+id)) throw new Error("doesn't exist")
  return remove(+id)
}

module.exports = {
  bookmark,
  unbookmark,
  favorite,
  watched
}
