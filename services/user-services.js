const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userServices = {
  getUserFollowings: (req, res, cb) => {

  },
  getUserFollowers: (req, cb) => {

  },
  getUserTweets: (req, res) => {

  },
  getUserLikes: (req, cb) => {

  },
  getUserProfile: (req, cb) => {

  },
  postUserProfile: (req, cb) => {

  }
}

module.exports = userServices
