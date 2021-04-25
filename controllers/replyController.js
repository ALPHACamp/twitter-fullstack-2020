const db = require('../models')
const Reply = db.Reply

const replyController = {
  postReply: (req, res) => {
    return Reply.create({
      comment: req.body.text,
      TweetId: req.body.tweetId,
      UserId: req.user.id
    })
      .then((reply) => {
        res.redirect(`/tweets/${req.body.tweetId}`)
      })
  }
}

module.exports = replyController