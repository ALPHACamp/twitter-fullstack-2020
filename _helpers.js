const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

function getUser (req) {
  return req.user
}

const imgurFileHandler = async file => {
  try {
    if (!file) return null
    const img = await imgur.uploadFile(file.path)
    return img?.link || null
  } catch (err) {
    throw new Error(err)
  }
}

const handlebarsHelpers = {
  currentYear: dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}

const removeAllSpace = str => {
  let newStr = ''
  newStr = str.replace(/\s/g, '')
  return newStr
}

const removeOuterSpace = str => {
  let newStr = ''
  newStr = str.trim()
  return newStr
}

const postValidation = description => {
  if (description.trim() !== '') return description
  return ''
}

module.exports = {
  ensureAuthenticated,
  getUser,
  imgurFileHandler,
  handlebarsHelpers,
  removeAllSpace,
  removeOuterSpace,
  postValidation
}
