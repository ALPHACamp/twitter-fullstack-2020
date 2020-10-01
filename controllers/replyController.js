const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const helpers = require("../_helpers")

let replyController = {
  getReplylist: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    }).then(reply => {
        return res.render('replylist', {
          reply: reply.toJSON()
        })
    })
  },
  postReply: (req, res) => {
    const replyDesc = req.body.text
    if (replyDesc.length === 0) {
       req.flash('error_messages', '不可空白')
      return res.redirect(`/replylist/${req.body.tweetId}`)
    } else {
      return Reply.create({
        comment: replyDesc,
        TweetId: req.body.tweetId,
        UserId: helpers.getUser(req).id
      })
      .then((reply) => {
        res.redirect(`/replylist/${req.body.tweetId}`)
      })
    }
  },
}
module.exports = replyController