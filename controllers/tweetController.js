const db = require('../models')
const { User, Tweet, Reply, Like } = db

const tweetController = {
  getTweets: (req, res) => {
    Promise.all([
      Tweet.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User,
          { model: Reply, nested: true, required: false },
          { model: Like, nested: true, required: false }
        ]
      }),
      User.findByPk(21, {
        raw: true,
        nest: true,
        include: [
          { model: User, as: 'Followings', required: false, order: [['createdAt', 'DESC']] },
          { model: User, as: 'Followers', required: false, order: [['createdAt', 'DESC']] },
          Tweet, Reply, Like
        ]
      })
    ]).then((result) => {
      const Tweets = result[0].map((r) => r.toJSON())
      const Tweet = Tweets[0]
      result[1].Followers = Array(13).fill(result[1].Followers)
      result[1].Followings = Array(11).fill(result[1].Followings)
      result[1].Tweets = Array(10).fill(result[1].Tweets)
      result[1].Replies = Array(12).fill(result[1].Replies)
      result[1].Likes = Array(15).fill({
        "id": 1,
        "UserId": 2,
        "TweetId": 3,
        "createdAt": '10:06 2010年10月19日',
        "updatedAt": '10:06 2010年10月19日'
      })
      const User = result[1]

      // return res.json({ Tweets, Tweet, User })
      return res.render('user', { Tweets, Tweet, User })
    })
  }
}

module.exports = tweetController