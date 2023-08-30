const { Reply } = require('../../models')

const replyController = {
  postReply: (req, res, next) => {
    const { TweetId, comment } = req.body
    const UserId = req.user.id
    if (!comment.trim) {
      req.flash('error_messages', '內容不可空白')
      return res.redirect('back')
    }

    Reply.create({
      UserId,
      TweetId,
      comment
    })
      .then(() => {
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  }
}
module.exports = replyController
