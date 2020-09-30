const db = require('../models')
const Reply = db.Reply
const User = db.User
const helpers = require("../_helpers")

let replyController = {
  postReply: (req, res) => {
    return Reply.create({
      comment: req.body.text,
      TweetId: req.body.tweetId,
      UserId: helpers.getUser(req).id
    })
      .then((reply) => {
        res.redirect(`/replylist/${req.body.tweetId}`)
      })
  },
}
module.exports = replyController