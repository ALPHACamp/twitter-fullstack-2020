const helpers = require('../_helpers')
const db = require('../models')
const { sequelize } = db
const { Op } = db.Sequelize
const { User, Tweet, Reply, Like, Followship } = db

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const userId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM replies WHERE replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`(SELECT likes.UserId FROM likes WHERE likes.TweetId = Tweet.id AND likes.UserId = ${userId})`), 'isLiked']
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        raw: true,
        nest: true,
        limit: 4
      })
      return res.render('tweets', { tweets })
      // return res.json({ tweets })
    } catch (err) {
      console.error(err)
    }
  },

  // getTweets: (req, res) => {
  //   Tweet.findAll({
  //     order: [['createdAt', 'DESC']],
  //     limit: 2,
  //     include: [User,
  //       { model: Reply, nested: true, required: false },
  //       { model: Like, nested: true, required: false }
  //     ]
  //   }).then((result) => {
  //     const data = result.map((r) => r.toJSON())
  //     return res.render('user', { data })
  //   })
  // },

  putTweet: async (req, res) => {
    try {
      const UserId = helpers.getUser(req)
      const { description } = req.body

      if (description.length > 140) {
        req.flash('error_messages', '不可超過 140 字')
        return res.redirect('/tweets')
      }

      if (!description.length) {
        req.flash('error_messages', '不可空白')
        return res.redirect('/tweets')
      }

      await Tweet.create({ UserId, description })
      return res.redirect('/tweets')
    } catch (err) {
      console.error(err)
    }
  },

  addLike: async (req, res) => {
    try {
      await Like.findOrCreate({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweetId
        }
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
          TweetId: req.params.tweetId
        }
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = tweetController