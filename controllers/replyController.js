const helpers = require('../_helpers')
const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User

const userService = require('../services/userService')

const replyController = {
  postReply: (req, res) => {
    const comment = req.body.comment

    if (!comment.length) {
      req.flash('error_msg', '回覆不可以空白')
      return res.redirect('back')
    }
    if (comment.length > 140) {
      req.flash('error_msg', '回覆不可超過140字!')
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


       console.log(replies)
       userService.getTopUser(req, res, topUser => {
         return res.render('replies', { replies, topUser })
       })

     })
  }
}

module.exports = replyController