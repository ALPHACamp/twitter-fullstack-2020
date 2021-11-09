const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

const replyController = {
  postReply: (req, res) => {
    if (!req.body.comment) {
      req.flash('error_messages', '回覆內容不存在')
      return res.redirect('back')
    } else if (req.body.comment.trim().length === 0) {
      req.flash('error_messages', '請輸入回覆內容!')
      return res.redirect('back')
    } else if (req.body.comment.length > 140) {
      req.flash('error_messages', '回覆內容超過140字數限制')
      return res.redirect('back')
    }
    Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.body.TweetId,
      comment: req.body.comment,
    })
      .then(() => {
        if (req.body.TweetId) {
          Tweet.findByPk(req.body.TweetId)
            .then((tweet) => {
              tweet.increment('replyCount')
            })
        }
      })
      .then(() => {
        req.flash('success_messages', '成功回覆推文')
        res.redirect(`/tweets/${req.body.TweetId}`)
      })

  }
}

module.exports = replyController