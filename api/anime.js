/** interacts with `bookmarks` */
const anilist = require('anilist-node')
const { exists, remove, append, modify } = require('./bookmarks')

// anilist api
const Anilist = new anilist()

/** Adds bookmark to the data file
 *  @param {string|number} id */
async function bookmark(id) {
  if (id === '' || isNaN(+id)) throw new Error('message:Please enter a valid Anilist id')
  if (exists(+id)) throw new Error('message:Bookmark already exists')
  const res = await Anilist.media.anime(+id)
  if (!res.id) throw new Error('message:Anime not found on Anilist')
  return append({
    id: res.id,
    title: res.title.userPreferred,
    status: res.status,
    episodes: res.episodes,
    format: res.format,
    description: res.description,
    cover: { image: res.coverImage.large, color: res.coverImage.color },
    banner: res.bannerImage,
    genres: res.genres,
    tags: res.tags.map((t) => t.name),
    related: res.relations.map((r) => ({ id: r.id, title: r.title.userPreferred })),
    url: res.siteUrl,
    favorite: false,
    watched: false,
    date: Date.now(),
    priority: 1 // 2: high > 1: medium > 0: low
  })
}

/** Search an entry by id and mark/unmark it as favorite
 *  @param {string|number} id */
async function favorite(id, favorite) {
  if (!exists(+id)) throw new Error("message:Operation on entry that doesn't exist")
  return modify(+id, { favorite })
}
/** Search an entry by id and mark/unmark it as watched
 *  @param {string|number} id */
async function watched(id, watched) {
  if (!exists(+id)) throw new Error("message:Operation on entry that doesn't exist")
  return modify(+id, { watched })
}

/** Search an entry by id and remove it from bookmarks
 *  @param {string|number} id */
async function unbookmark(id) {
  if (!exists(+id)) throw new Error("message:Operation on entry that doesn't exist")
  return remove(+id)
}

/** Search an entry by id and change its priority
 *  @param {string|number} id
 *  @param {0|1|2} priority
 */
async function prioritize(id, priority) {
  if (!exists(+id)) throw new Error("message:Operation on entry that doesn't exist")
  return modify(+id, { priority })
}

module.exports = {
  bookmark,
  unbookmark,
  favorite,
  watched,
  prioritize
}
