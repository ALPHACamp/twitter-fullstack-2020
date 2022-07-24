const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getUsers: (req, res, cb) => {

  },
  getTweets: (req, cb) => {

  },
  deleteTweet: (req, res) => {

  },
  adminSignIn: (req, cb) => {

  }
}

module.exports = adminServices
