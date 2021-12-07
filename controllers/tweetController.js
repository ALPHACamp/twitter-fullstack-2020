const helpers = require('../_helpers')
const db = require('../models')
const { sequelize } = db
const { User, Tweet, Reply, Like, Followship } = db
const tweetTime = require('../config/tweetTime')

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
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM replies WHERE replies.TweetId = Tweet.id)'
            ),
            'replyCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM likes WHERE likes.TweetId = Tweet.id)'
            ),
            'likeCount'
          ],
          [
            sequelize.literal(
              `(SELECT likes.UserId FROM likes WHERE likes.TweetId = Tweet.id AND likes.UserId = ${userId})`
            ),
            'isLiked'
          ]
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'], require: false }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      return tweets
    } catch (err) {
      console.error(err)
    }
  },

  addTweet: async (req, res) => {
    try {
      const { description } = req.body

      if (description.length > 130 || !description.length) {
        return res.end()
      }

      await Tweet.create({ UserId: helpers.getUser(req).id, description })
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
          TweetId: Number(req.params.tweetId)
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
  },

  getTweet: async (req, res) => {
    try {
      let tweet = await Tweet.findByPk(req.params.tweetId, {
        include: [User, Like]
      })
      tweet.dataValues.time = tweetTime.time(tweet.dataValues.createdAt)
      tweet.dataValues.date = tweetTime.date(tweet.dataValues.createdAt)

      let replies = await Reply.findAll({
        where: { TweetId: tweet.id },
        include: [{ model: User, attributes: { exclude: ['password'] } }],
        order: [['createdAt', 'DESC']]
      })

      const userId = helpers.getUser(req).id
      let isLiked = !!(await Like.findOne({
        where: { UserId: userId, TweetId: req.params.tweetId }
      }))

      const pops = await tweetController.getPopular(req, res)

      return res.render('user', {
        tweet: tweet.toJSON(),
        replies: replies.map((reply) => reply.toJSON()),
        isLiked,
        tweetPage: true,
        pops
      })
    } catch (err) {
      console.error(err)
    }
  },

  getPopular: async (req, res) => {
    try {
      let pops = await User.findAll({
        attributes: [
          'id',
          'email',
          'name',
          'avatar',
          'account',
          'role',
          'createdAt',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM followships WHERE followships.followingId = User.id)'
            ),
            'followerCount'
          ]
        ]
      })

      let followings = await Followship.findAll({
        where: { followerId: helpers.getUser(req).id }
      })
      followings = followings.map(
        (following) => following.dataValues.followingId
      )

      pops = pops.filter((pop) => pop.dataValues.role !== 'admin')
      pops = pops.filter((pop) => pop.dataValues.id !== helpers.getUser(req).id)
      pops = pops
        .map((pop) => ({
          ...pop.dataValues,
          isFollowing: followings.includes(pop.dataValues.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10)

      return pops // 返回前10 populars array
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = tweetController
