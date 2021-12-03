const db = require('../models')
const { User, Tweet, Reply, Like } = db

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User,
        { model: Reply, nested: true, required: false },
        { model: Like, nested: true, required: false }
      ]
    }).then((result) => {
      const data = result.map((r) => r.toJSON())
      // return res.json(data)
      return res.render('user', { data, tweet: data[0] })
    })
  }
}

module.exports = tweetController