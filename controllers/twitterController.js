const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const twitterController = {
  getTwitters: (req, res) => {
    return Promise.all([
      Tweet.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Reply, Like]
      }).then((tweets) => {
        return res.render('twitter', {
          tweets: tweets
        })
      })
    ])
  },
}

module.exports = twitterController