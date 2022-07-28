const assert = require('assert')
const helpers = require("../_helpers")
const { User, Tweet, Like, Reply } = require('../models')

const replyController = {
  getReplies: (req, res) => {
    return res.render('replies')
  }



}

module.exports = replyController
