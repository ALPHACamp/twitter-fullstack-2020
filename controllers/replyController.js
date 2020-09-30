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
            { model: Reply, include: [User] },
        ]
    }).then(tweet => {
        return res.render('replylist', {
            tweet: tweet.toJSON()
        })
    })
  },
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