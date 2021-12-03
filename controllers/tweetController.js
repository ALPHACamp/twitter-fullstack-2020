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

  addLike: async (req, res) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  removeLike: async (req, res) => {
    try {
      await Like.destroy({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.restaurantId
        }
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = tweetController