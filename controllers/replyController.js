const db = require('../models')
const Reply = db.Reply
const helpers = require('../_helpers')


const replyController = {
  postReply: (req, res) => {
    const comment = req.body.description
    if (!comment.length) {
      req.flash('error_messages', '回覆不可為空白!')
      res.redirect('back')
    }
    if (comment.length > 140) {
      req.flash('error_messages', '回覆不可超過140字!')
      res.redirect('back')
    }
    return Reply.create({
      UserId: req.user.id,
      TweetId: req.params.id,
      comment: req.body.description,
    })
      .then((reply) => {
        res.redirect(`/tweets/${req.params.id}`)
      })

  },

}

module.exports = replyController