const { Tweet, User, Reply } = require('../models')
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
          { model: Tweet, include: [User] }
        ],
        order: [['createdAt', 'DESC']]
      })
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [User]
      })
      const user = helper.getUser(req)
      console.log(replies)
      return res.render('replies', { tweet: tweet.toJSON(), replies, user })
    } catch (err) {
      next(err)
    }
  },
  postReplies: async (req, res, next) => {
    try {
      const UserId = helper.getUser(req).id
      const TweetId = req.params.id
      const { comment } = req.body
      if (comment.length <= 0) throw new Error('回覆不可空白')
      if (comment.length > 140) throw new Error('超過140個字數限')
      const reply = await Reply.create({ UserId, TweetId, comment })
      if (!reply) throw new Error('回覆不成功')
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
