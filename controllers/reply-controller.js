const { Tweet, Reply, User, Like } = require('../models')
const helper = require('../_helpers')

const replyController = {
  getReplies: (req, res, next) => {
    const currentUser = helper.getUser(req)
    const personalTweetRoute = true
    const TweetId = req.params.id
    return Tweet.findByPk(TweetId, {
      include: [
        User,
        { model: Like, as: 'LikedUsers' },
        { model: Reply, order: [['createdAt', 'DESC']], include: [User] }
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error('No tweet found!')
        const { dataValues, Replies, User, LikedUsers } = tweet
        tweet = {
          ...dataValues,
          user: User.dataValues,
          repliesCount: Replies.length,
          likesCount: LikedUsers.filter(likedUser => likedUser.isLike).length,
          isLiked: LikedUsers.some(likedUser => likedUser.UserId === currentUser.id && likedUser.isLike)
        }
        const replies = tweet.Replies.map(reply => {
          const { dataValues, User } = reply
          return {
            ...dataValues,
            user: User.dataValues
          }
        })
        res.render('tweet', { tweet, replies, personalTweetRoute })
      })
      .catch(err => next(err))
  },
  postReply: async (req, res, next) => {
    let { comment } = req.body
    const UserId = helper.getUser(req).id
    const TweetId = Number(req.body.TweetId)
    console.log(req.body)
    // 後端驗證
    try {
      // 修剪留言內容去掉前後空白
      comment = comment.trim()
      if (!comment) throw new Error('內容不可空白')

      await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.redirect(`/tweets/${TweetId}/replies`)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = replyController
