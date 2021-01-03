const { app } = require('electron')
const fs = require('fs')
const path = require('path')

// const DATA_PATH = path.join(__dirname, '..', 'data.json')
const DATA_PATH = path.join(app.getPath('userData'), 'data.json')
const DEFAULT_DATA = '{ "bookmarks": [] }'

function init() {
  // make this return promise?
  fs.stat(DATA_PATH, (err) => {
    if (err)
      return fs.writeFile(DATA_PATH, DEFAULT_DATA, (err) => {
        if (err) console.error(err)
        console.log('Data file initialized at ' + DATA_PATH)
      })
    console.error('Data file already exists at ' + DATA_PATH)
  })
}

function read() {
  return require(DATA_PATH)
}

/**
 *  @param {number} id
 *  @returns {boolean}
 */
function exists(id) {
  return read().bookmarks.some((entry) => entry.id === id)
}

function find(id) {
  return read().bookmarks.find((entry) => entry.id === id)
}

/**
 *  @param {any} anime
 *  @returns {Promise<T>}
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

/**
 *  @param {number} id
 *  @param {object} values
 *  @returns {Promise<T>}
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

/**
 *  @param {number} id
 *  @returns {Promise<T>}
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
