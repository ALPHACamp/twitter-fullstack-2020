const { User, Tweet, Reply } = require('../models')

const replyController = {
  postReply: (req, res) => {
    if (!req.body.content) {
      req.flash('error_messages', "Content didn't exist")
      return res.redirect('back')
    } else if (req.body.content.length == 0) {
      req.flash('error_messages', "Please enter some content !")
      return res.redirect('back')
    } else if (req.body.content.length > 140) {
      req.flash('error_messages', "Content is over limit!")
      return res.redirect('back')
    }
    return Reply.create({
      UserId: req.user.id,
      TweetId: req.body.TweetId,
      content: req.body.content
    })
      .then(() => {
        return Tweet.findByPk(req.body.TweetId)
          .then((tweet) => {
            return tweet.increment('replyCount')
          })
      })
      .then((reply) => {
        res.redirect(`/tweets/${req.body.TweetId}`)
      })
  },
  deleteReply: (req, res) => {
    return Reply.findByPk(req.params.id)
      .then((reply) => {
        reply.destroy().then(() => {
          return Tweet.findByPk(reply.TweetId)
            .then((tweet) => {
              res.redirect(`/tweets/${tweet.id}`)
              return Promise.all(tweet.decrement('replyCount'))
            })
        })
      })
  }
}

module.exports = replyController
