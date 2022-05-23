const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('Asia/Taipei')

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
  amORpm: a => {
    const parsedTime = dayjs.tz(a)
    const hr = dayjs(parsedTime).format('H')
    if (Number(hr) > 12) return '下午'
    return '上午'
  },
  createdYear: a => {
    const parsedTime = dayjs.tz(a)
    return dayjs(parsedTime).format('YYYY')
  },
  createdMonth: a => {
    const parsedTime = dayjs.tz(a)
    return dayjs(parsedTime).format('M')
  },
  createdDay: a => {
    const parsedTime = dayjs.tz(a)
    return dayjs(parsedTime).format('D')
  },
  createdTime: a => {
    const parsedTime = dayjs.tz(a)
    return dayjs(parsedTime).format('h:mm')
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  BASE_URL: process.env.BASE_URL
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
