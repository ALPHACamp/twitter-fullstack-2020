const db = require('../models')
const { Tweet, User, Like, Reply, sequelize } = db
const helper= require('../_helpers')
const replyController = {
  getReplies: (req, res, next) => {
    const TweetId = req.params.id
    return Tweet.findByPk(TweetId, {
      include: {
        model: Reply
      }
    }).then(tweet => {
      if (!tweet) {
        throw new Error('This tweet id do not exist')
      }
      return res.json(tweet.toJSON())
    }).catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const TweetId = req.params.id
    const { comment } = req.body
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) {
          throw new Error('This tweet id do not exist')
        }
        return Reply.create({
          TweetId,
          UserId: helper.getUser(req).id,
          comment
        })
      }).then(() => {
        res.redirect('/')
      }).catch(err => next(err))
  }
}
module.exports = replyController
