const db = require('../models')
const Reply = db.Reply
const helpers = require('../_helpers')


const replyController = {
  postReply: (req, res) => {
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