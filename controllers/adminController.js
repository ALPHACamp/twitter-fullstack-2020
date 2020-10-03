const db = require('../models')
const { User, Tweet, Like, Reply, Followship } = db


const adminControllers = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [{ model: User }]
    })
      .then(tweets => {
        // console.log(tweets)
        tweets = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.substring(0, 200),
        }))
        // console.log(tweets)
        return res.render('admin/tweets', { tweets })
      })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
          .then(comment => {
            res.redirect('/admin/tweets')
          })
      })
  },
  getUsers: (req, res) => {
    return User.findAll({
      nest: true,
      include: [
        { model: Like },
        { model: Tweet },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      console.log(users[0])
      res.render('admin/users', { users })
    })
  },
}

module.exports = adminControllers