/** abstracts the fs operations */
const { app } = require('electron')
const fs = require('fs')
const path = require('path')

// the AppData directory
const DATA_PATH = path.join(app.getPath('userData'), 'data.json')
const DEFAULT_DATA = '{ "bookmarks": [] }' // default JSON data

function init() {
  // checks if file exists, create it with default data if it doesn't
  // TODO?: make this return promise
  fs.stat(DATA_PATH, (err) => {
    if (err)
      return fs.writeFile(DATA_PATH, DEFAULT_DATA, (err) => {
        if (err) console.error(err)
        console.log('Data file initialized at ' + DATA_PATH)
      })
    console.error('Data file already exists at ' + DATA_PATH)
  })
}

/** returns the data read from data.json
 *  @returns {{bookmarks: object[]}}
 */
function read() {
  return require(DATA_PATH)
}

/** check if an entry exists in data.bookmarks based on id
 *  @param {number} id
 *  @returns {boolean}
 */
function exists(id) {
  return read().bookmarks.some((entry) => entry.id === id)
}

/** returns an entry if found, based on it's id
 *  @param {number} id
 *  @returns {object}
 */
function find(id) {
  return read().bookmarks.find((entry) => entry.id === id)
}

/** adds new entry to data.bookmarks 
 *  Note! it actually prepends lol
 *  @param {object} anime
 *  @returns {Promise<any>}
 */
function append(entry) {
  return new Promise((resolve, reject) => {
    const data = read()
    data.bookmarks.unshift(entry)
    fs.writeFile(DATA_PATH, JSON.stringify(data), (err) => {
      if (err) return reject(err)
      resolve('added')
    })
  })
}

/** modifies the entry based on provided values
 *  this method can accept multiple modifications
 *  @param {number} id
 *  @param {object} values
 *  @returns {Promise<any>}
 */
function modify(id, values) {
  return new Promise((resolve, reject) => {
    const data = read()
    data.bookmarks.forEach((entry) => {
      if (entry.id === id)
        for (const key of Object.keys(values)) {
          entry[key] = values[key]
        }
    })
    fs.writeFile(DATA_PATH, JSON.stringify(data), (err) => {
      if (err) return reject(err)
      resolve('modified')
    })
  })
}

/** removes an entry based on its id
 *  @param {number} id
 *  @returns {Promise<any>}
 */
function remove(id) {
  return new Promise((resolve, reject) => {
    const data = read()
    data.bookmarks = data.bookmarks.filter((entry) => entry.id !== id)
    fs.writeFile(DATA_PATH, JSON.stringify(data), (err) => {
      if (err) return reject(err)
      resolve('modified')
    })
  })
}

module.exports = {
  init,
  exists,
  read,
  append,
  modify,
  remove,
  find
}
