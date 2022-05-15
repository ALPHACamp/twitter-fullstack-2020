const { Tweet, User, Reply, Followship } = require('../models')
const helpers = require('../_helpers')
const Sequelize = require('sequelize')

const tweetsController = {
  getTweets: async (req, res, next) => {
    // TODO: like 與 replies 數量
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        },
        raw: true,
        nest: true
      })

      // 右側topUsers, sort by跟隨者follower數量 & isFollowed 按鈕
      const users = await User.findAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: { model: User, as: 'Followers' }
      })
      const topUsers = users.map(user => { return user.get({ plain: true }) }).map(u => {
        return {
          ...u,
          Followers: u.Followers.length,
          isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(u.id))
        }
      }).sort((a, b) => b.Followers - a.Followers).slice(0, 10)
      return res.render('index', { tweets, topUsers })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    const tweetId = Number(req.params.tweetId)

    try {
      const tweet = await Tweet.findByPk(tweetId, {
        raw: true
      })
      const replies = await Reply.findAll({
        where: { tweetId },
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        },
        raw: true,
        nest: true
      })

            // 右側topUsers, sort by跟隨者follower數量 & isFollowed 按鈕
      const users = await User.findAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: { model: User, as: 'Followers' }
      })
      const topUsers = users.map(user => { return user.get({ plain: true }) }).map(u => {
        return {
          ...u,
          Followers: u.Followers.length,
          isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(u.id))
        }
      }).sort((a, b) => b.Followers - a.Followers).slice(0, 10)
      return res.render('tweet', { tweet, replies, topUsers })
    } catch (err) {
      next(err)
    }
  },
  addTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req) && helpers.getUser(req).id
    try {
      if (!description || description.trim().length === 0) throw new Error('不能發空白推！')
      if (description.length > 140) throw new Error('推文不能超過140字！')
      await Tweet.create({
        description,
        UserId
      })
      return res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  createFakePage: (req, res, next) => {
    try {
      return res.render('createFake')
    } catch (err) {
      next(err)
    }
  },
  replyFakePage: async (req, res, next) => {
    const tweetId = Number(req.params.tweetId)
    const tweet = await Tweet.findByPk(tweetId, {
      include: {
        model: User,
        attributes: ['name', 'account', 'avatar']
      },
      raw: true,
      nest: true
    })
    try {
      return res.render('replyFake', tweet)
    } catch (err) {
      next(err)
    }
  },
  addReply: async (req, res, next) => {
    const TweetId = Number(req.params.tweetId)
    const UserId = helpers.getUser(req) && helpers.getUser(req).id
    const { comment } = req.body

    try {
      if (!comment || comment.trim().length === 0) throw new Error('不能發空白回覆！')
      if (comment.length > 140) throw new Error('推文不能超過140字！')
      await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetsController
