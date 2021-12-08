const db = require('../models')
const Reply = db.Reply
const helpers = require('../_helpers')

const replyController = {
  //設定新增留言
  postReply: (req, res) => {
    return Reply.create({
      comment: req.body.comment,
      TweetId: req.params.tweetId,
      UserId: helpers.getUser(req).id
    }).then(replies => {
      res.redirect(`/tweets/${req.params.tweetId}/replies`)
    })
  }
}

module.exports = replyController