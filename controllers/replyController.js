const helpers = require('../_helpers')
const { User, Reply, Tweet } = require('../models')
const replyController = {
  getReply: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        include: [User, { model: Tweet, include: User }]
      })
      //render要修改
      return res.render('tweets', { replies: replies.toJSON() })
    }
    catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      if (!comment) {
        req.flash('error_messages', '回覆內容不存在！')
        return res.redirect('back')
      }
      if (comment.trim() === '') {
        req.flash('error_messages', '回覆內容不能為空！')
        return res.redirect('back')
      }
      if (comment && comment.length > 140) {
        req.flash('error_messages', '回覆內容不能超過140字!')
        return res.redirect('back')
      }
      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id,
        comment
      })
      req.flash('success_messages', '成功新增回覆！')
      return res.redirect(`/tweets/${req.params.tweet_id}`)
    }
    catch (err) {
      next(err)
    }
  }
}
module.exports = replyController
