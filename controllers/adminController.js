const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Reply, Like } = db

const adminController = {
  signin: (req, res) => {
    return res.render('admin/signin')
  },
  getTweets: (req, res) => {
    Tweet.findAll({
      raw: true, nest: true,
      include: [User], order: [['createdAt', 'DESC']]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50),
      }))
      return res.render('admin/tweets', { tweets: tweets })
    }
    )
  },
  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id).then(tweet => {
      tweet.destroy()
      return res.redirect('back')
    })
  }
}
module.exports = adminController