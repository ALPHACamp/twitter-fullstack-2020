const { Followship, Like, Reply, Tweet, User } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  getIndex: (req, res, next) => {
    return Promise.all([
      Tweet.findAll({
        include: [{ model: User }],
        where: { UserId: helpers.getUser(req).id },
        order: [['createdAt', 'desc']],
        raw: true,
        nest: true
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' } // id: !req.user.id,待補
      })
    ])
      .then(([tweets, users]) => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length
            // isFollowed: req.user.Followings.some(f => f.id === user.id) //req.user還未設定、root不該出現
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('tweets', { tweets, users: result.slice(0, 10) })
      })
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (description.length > 140) {
        throw new Error('請以 140 字以內為限')
      } else if (description.trim() === '') {
        throw new Error('內容不可空白')
      }
      const UserId = helpers.getUser(req).id
      const createdTweet = await Tweet.create({
        UserId,
        description
      })
      if (!createdTweet) {
        throw new Error('發推失敗')
      }
      req.flash('success_messages', '發推成功！')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getTweet: (req, res, next) => {
  },
  postLike: (req, res, next) => {
  },
  postUnlike: (req, res, next) => {
  },
  postReply: (req, res, next) => {
  }

}

module.exports = tweetController
