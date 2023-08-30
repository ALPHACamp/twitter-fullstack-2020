const { Reply } = require('../models')
const helper = require('../_helpers')

const replyController = {
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
