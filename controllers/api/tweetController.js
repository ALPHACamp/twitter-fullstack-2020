const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../../_helpers')

const tweetController = {
  getTweetModal: (req, res) => {
    return res.render('tweet')
  }
}