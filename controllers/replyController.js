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
        console.log(req.body.tweetId)
        console.log(req.body.description)
        console.log(req.user.id)
        console.log(req.params.id)
        console.log(req.body.tweetId)
        res.redirect(`/tweets/${req.body.tweetId}`)
      })
  },

}

module.exports = replyController