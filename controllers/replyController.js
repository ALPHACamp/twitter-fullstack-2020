const db = require('../models')
const ReplyComment = db.ReplyComment

const replyController = {
  postReply: (req, res) => {
    const { comment } = req.body
    if (!comment) {
      req.flash('error_messages', '留言不得為空白')
      return res.redirect('back')
    }
    else {
      ReplyComment.create({
        UserId: req.user.id,
        ReplyId: req.params.replyId,
        comment
      })
      .then(replyComment => {
        return res.redirect('back')
      })
    }
  }
}

module.exports = replyController