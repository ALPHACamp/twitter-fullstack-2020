const { Tweet, User, Reply, Like } = require('../models')
const helper = require('../_helpers')

const replyController = {
  getReplies: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: req.params.id },
        include: [
          User,
          { model: Tweet, include: [User] },
          { model: Tweet, include: [Like] }
        ],
        order: [['created_at', 'DESC']]
      })
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [User, Like]
      })
      const user = helper.getUser(req)
      const likedTweetUsers = tweet.Likes.map(like => like.UserId)
      user.isLiked = likedTweetUsers.includes(user.id)
      return res.render('replies', { tweet: tweet.toJSON(), replies, user })
    } catch (err) {
      next(err)
    }
  },
  postReplies: async (req, res, next) => {
    try {
      const comment = req.body.comment.trim()
      if (!comment.length) {
        req.flash('error_messages', '回覆不可以空白!')
        return res.redirect('back')
      }
      if (comment.length > 140) {
        req.flash('error_messages', '回覆不可超過140字!')
        return res.redirect('back')
      }
      await Reply.create({
        UserId: helper.getUser(req).id,
        TweetId: req.params.id,
        comment
      })
      req.flash('success_messages', '成功回覆')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
