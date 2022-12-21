const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const { getUser } = require('../_helpers')

const replyController = {
  getReplies: (req, res, next) => {
    const loginUser = getUser(req).id
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
    })
    ])
      .then(([tweet, replies]) =>
        res.render('replies', { tweet, replies })
      )
      .catch(err => next(err))
  }
}

module.exports = replyController
