const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply


const tweetController = {
  getTweets: (req, res) => {

    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']],
    }).then((tweets) => {
      return res.render('tweets', { tweets })
    })
  },

  getTweet: (req, res) => {
    console.log('req.params', req.params.id)
    Tweet.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [User,
        { model: Reply, include: [User] }
      ]

    }).then(tweet => {
      return res.render('tweet', {
        tweet: tweet
      })
    })
  },

  getUser: async (req, res) => {

    const result = await Tweet.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        userId: req.params.id
      },
      distinct: true,
    })
    const tweets = result.rows
    return User.findByPk(req.params.id)
      .then(user => {
        res.render('profile', {
          user: user, tweets
        })
      })
  },

}

module.exports = tweetController