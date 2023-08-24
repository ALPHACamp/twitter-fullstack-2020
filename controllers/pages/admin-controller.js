const jwt = require('jsonwebtoken')
const _helper = require('../../_helpers')

const adminController = {
  getTweets: (req, res, next) => {
    res.render('admin/tweets')
  }
}

module.exports = adminController
