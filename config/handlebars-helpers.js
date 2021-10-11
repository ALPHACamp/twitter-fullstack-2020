const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },

  ifCon: function (a) {
    console.log('============',a)
  },

  ifCheck: function (a, b, options) {
    if (a.dataValues.id === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },

  moment: function (time) {
    return moment(time).fromNow()
  },

  getId: function (user) {
    return user.dataValues.id
  },

  getAvatar: function (user) {
    return user.dataValues.avatar
  },

  getAccount: function (user) {
    return user.dataValues.account
  },

  checkLike: function (user, arr, options) {
    arr = arr.map(item => item.UserId)
    const id = Number(user.id)
    if (arr.includes(id)) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },

  checkReply: function (user, arr, options) {
    arr = arr.map(item => item.UserId)
    const id = Number(user.id)
    if (arr.includes(id)) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },

  checkCommentReply: function (user, arr, options) {
    arr = arr.map(item => item.user.id)
    const id = Number(user.id)
    if (arr.includes(id)) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },

  countNum: function (arr) {
    return arr.length
  },

  checkIfBeLiked: function (arr, options) {
    return arr.length ? options.fn(this) : options.inverse(this)
  },

  leftSdieBarCheck: function (data, options) {
    if (data === ('userInfo') || data === ('userTweets') || data === ('userReplies') || data === ('userLikes')) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }
}