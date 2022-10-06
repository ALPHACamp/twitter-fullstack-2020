const { User, Tweet, Like, Reply } = require('../models')

const adminController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      raw: true,
      nest: true,
      order: [['created_at', 'DESC']] // 反序
    }).then(tweets => {
      const result = tweets.map(tweet => {
        return {
          ...tweet,
          description: tweet.description.substring(0, 50)
        }
      })
      res.render('admin/tweets', { tweets: result })
    })
  },
  signinPage: (req, res) => {
    return res.render('admin/signin')
  },
  usersPage: (req, res) => {
    res.render('admin/users')
  }
}

module.exports = adminController