const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const helpers = require('../_helpers')

const replyController = {
  //設定新增留言
  postReply: (req, res) => {
    return Reply.create({
      comment: req.body.comment,
      TweetId: req.params.tweetId,
      UserId: helpers.getUser(req).id
    }).then(reply => {
      return Tweet.findOne({ where: { id: reply.TweetId } }).then(tweet => {
        return tweet.increment('replyCounts')
      }).then(tweet => {
        return res.redirect(`/tweets/${req.params.tweetId}/replies`)
      })
    })
  }
}

module.exports = replyController