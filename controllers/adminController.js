const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const adminController = {
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    return res.render('admin/tweets')
  }
}

module.exports = adminController