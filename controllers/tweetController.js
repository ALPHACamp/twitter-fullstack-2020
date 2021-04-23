const db = require('../models')
const Tweet = db.Tweet

const tweetController = {
  getTweets: (req, res) => {

    return Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => {
        console.log(tweets)
        return res.render('tweets', { tweets })
      })
  },
  getTweet: (req, res) => {
    return res.render('tweet')
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
        console.log(user)
        res.render('profile', {
          user: user, tweets
        })
      })
  },

}

module.exports = tweetController