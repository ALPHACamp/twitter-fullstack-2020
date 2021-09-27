const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User



const replyController = {
  postReply: async(req, res) =>{
    const {comment, TweetId, UserId} = req.body
    if (!comment.trim()) {
      req.flash('error_messages', '回覆不能空白！')
      return res.redirect('back')
    }
    await Reply.create({
      comment: comment,
      TweetId: TweetId,
      UserId: UserId
    })
    return res.redirect(`/tweets/${TweetId}/replies`)
  }
}

module.exports = replyController