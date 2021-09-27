const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User

const helpers = require('../_helpers')

const replyController = {
  postReply: async (req, res) =>{
    const currentUserId = helpers.getUser(req).id
    const { comment, TweetId } = req.body

    if (!comment.trim()) {
      req.flash('error_messages', '回覆不能空白！')
      return res.redirect('back')
    }
    await Reply.create({
      comment: comment,
      TweetId: TweetId,
      UserId: currentUserId
    })
    return res.redirect('back')
  }
}

module.exports = replyController