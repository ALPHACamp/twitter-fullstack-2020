const { Tweet, User, Reply } = require('../models')
const helper = require('../_helpers')

const replyController = {
  getReplies: async (req, res, next) => {
    try {
      const userId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      const [tweet, replies] = await Promise.all([
        Tweet.findOne({
          where: { id: TweetId },
          attributes: ['id', 'description', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: User, as: 'LikedUsers', attributes: ['id'] }
          ]
        }),
        Reply.findAll({
          order: [['createdAt', 'DESC']],
          where: { TweetId },
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
        })
      ])
      if (!tweet) throw new Error('此篇貼文不存在')

      const tweetData = {
        ...tweet.toJSON(),
        isLiked: tweet.LikedUsers.some(item => item.id === userId)
      }

      const repliesData = replies.map(reply => ({
        ...reply.toJSON()
      }))

      res.render('reply', { tweet: tweetData, replies: repliesData, leftColTab: 'userHome' })
    } catch (err) {
      next(err)
    }
  },
  postReplies: async (req, res, next) => {
    try {
      const UserId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      const comment = helper.postValidation(req.body.comment)
      if (comment.length <= 0) throw new Error('送出回覆不可為空白')
      if (comment.length > 140) {
        req.flash('error_messages', '送出回覆超過限制字數140個字')
        res.redirect('back')
      }
      const reply = await Reply.create({ UserId, TweetId, comment })
      if (!reply) throw new Error('回覆不成功')
      req.flash('success_messages', '成功送出回覆')
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
