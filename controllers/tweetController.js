const db = require('../models')
const { User, Tweet, Reply, Like } = db

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      limit: 2,
      include: [User,
        { model: Reply, nested: true, required: false },
        { model: Like, nested: true, required: false }
      ]
    }).then((result) => {
      const data = result.map((r) => r.toJSON())
      return res.render('user', { data })
    })
  },

  getTweet: (req, res) => {
    res.send('Andrew Wu')
  }
}

module.exports = tweetController