const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Follow = db.Follow

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [Reply, User],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      console.log(tweets)
      return res.render('./admin/tweets', { layout: 'admin', tweets: tweets })
    })
  },

  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id).then(tweet => {
      return tweet.destroy().then(tweet => {
        req.flash('success_messages', 'Tweet has been deleted.')
        return res.redirect('back')
      })
    })
  },

  getUsers: (req, res) => {
    return User.findAll({
      // include: [Reply, Follow],
      order: [['id', 'ASC']]
    }).then(users => {
      return res.render('./admin/users', { layout: 'admin', users: users })
    })
  }
}

module.exports = adminController
