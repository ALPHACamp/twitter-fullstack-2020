const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const replyController = {
  getReplies: (req, res, next) => {
    const loginUser = helpers.getUser(req).id
    const tweetId = req.params.id
    return Promise.all([Tweet.findByPk(tweetId, {
      attributes: {
        include: [
          [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)`), 'repliesCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)`), 'likesCount'],
          [sequelize.literal(`(SELECT (COUNT(*)>0) FROM Likes WHERE user_id = ${loginUser} AND tweet_id = Tweet.id)`), 'isliked']
        ]
      },
      include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
      nest: true,
      raw: true
    }),
    Reply.findAll({
      where: { TweetId: tweetId },
      include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
      nest: true,
      raw: true
    }),
    User.findAll({
      where: { role: 'user' },
      include: [{ model: User, as: 'Followers' }]
    })
    ])
      .then(([tweet, replies, users]) => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followCount - a.followCount)
        res.render('replies', { tweet, replies, result })
      })
      .catch(err => next(err))
  },
  postReplies: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    const comment = String(req.body.description)

    if (!comment.trim()) {
      req.flash('error_messages', '回覆不可以空白!')
      res.redirect('back')
    } else if (comment.length > 50) {
      req.flash('error_messages', '回覆不可超過50字!')
      res.redirect('back')
    } else {
      return Reply.create({
        UserId,
        TweetId,
        comment
      })
        .then(() => {
          req.flash('success_messages', '成功回覆')
          res.redirect(`/tweets/${TweetId}/replies`)
        })
        .catch(err => next(err))
    }

  }
}

module.exports = replyController
