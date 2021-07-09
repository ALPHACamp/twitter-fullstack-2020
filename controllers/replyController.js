const { User, Tweet, Reply } = require('../models')

const replyController = {
  postReply: (req, res) => {
    return Reply.create({
      UserId: req.user.id,
      TweetId: req.body.TweetId,
      content: req.body.content
    })
      .then((reply) => {
        res.redirect(`/tweets/${req.body.TweetId}`)
      })
  },
  deleteReply: (req, res) => {
    return Reply.findByPk(req.params.id)
      .then((reply) => {
        reply.destroy()
          .then((reply) => {
            res.redirect(`/tweets/${reply.TweetId}`)
          })
      })
  }
}

module.exports = replyController
