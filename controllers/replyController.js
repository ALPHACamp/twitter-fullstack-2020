const helpers = require('../_helpers')
const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User

const replyController = {
  postReply: (req, res) => {
    const comment = req.body.comment

    if (comment.trim() === '') {
      req.flash('error_msg', '回覆不可以空白')
      return res.redirect('back')
    }
    return Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id,
      comment: comment
    })
      .then((reply) => {
        req.flash('success_msg', '成功回覆')
        return res.redirect('back')
      })
  },
  getReply: (req, res) => {
    return Reply.findAll({
      raw: true,
      nest: true,
      where: { TweetId: req.params.id },
      include: [
        User,
        { model: Tweet, include: [ User ] }
      ]
    })
     .then(replies => {
       return res.render('reply', { replies })
     })
  }
}

module.exports = replyController