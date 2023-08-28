const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../helpers/auth-helpers')
const replyController = {
//  add controller action here

  getTweetReplies: (req, res, next) => {
    const { id } = req.params

    Promise.all([
      Tweet.findByPk(id, {
        include: [{ model: User }, { model: Reply }, { model: Like }]
        // raw: true,
        // nest: true
      }),
      Reply.findAll({
        where: { tweetId: id },
        order: [['createdAt', 'DESC']],
        include: [{ model: User }, { model: Tweet, include: User }],
        raw: true,
        nest: true
      }),
      Like.findAll({
        where: { UserId: req.user.id },
        raw: true
      })
    ])
      .then(([tweet, replies, likes]) => {
        const likedTweets = likes.map(like => like.tweetId)
        // console.log(likes)可能更測試檔沒過有關
        const isLiked = likedTweets.includes(tweet.id)
        res.render('replies', { tweet: tweet.toJSON(), replies, isLiked })
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const userId = req.user.id
    const { tweetId } = req.params
    const { comment } = req.body
    if (!comment) throw new Error('內容不可空白')
    Reply.create({ userId, tweetId, comment })
      .then(() => {
        const { tweetId } = req.params
        res.redirect(`/tweets/${tweetId}/replies`)
      })
      .catch(err => next(err))
  }
}

module.exports = replyController
