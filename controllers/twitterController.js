const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const twitterController = {
  getTwitters: (req, res) => {
    Tweet.findAndCountAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    }).then(tweets => {
      const tweetData = tweets.rows.map(row => ({
        ...row.dataValues,
        tweetUserId: row.User.dataValues.id,
        tweetUserAvatar: row.User.dataValues.avatar,
        tweetUserName: row.User.dataValues.name,
        tweetUserAccount: row.User.dataValues.account,
        tweetId: row.id,
        tweetContent: row.content,
        tweetRepliesCount: row.Replies.length,
        tweetLikesCount: row.Likes.length,
      }))
      return res.render('twitter', {
        tweets: tweetData,
      })
    })
  },
  getTwitter: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        Reply,
        Like,
        User
      ]
    }).then(tweet => {
      const tweetUser = tweet.dataValues.User.dataValues
      const tweetRepliesCount = tweet.dataValues.Replies.length
      const tweetLikesCount = tweet.dataValues.Likes.length
      const whereQuery = {}
      whereQuery.tweetId = Number(req.params.id)
      Reply.findAndCountAll({
        include: [
          User
        ],
        where: whereQuery,
      }).then(reply => {
        const replyUser = reply.rows
        return res.render('replyList', {
          tweet: tweet,
          tweetUser: tweetUser,
          tweetRepliesCount: tweetRepliesCount,
          tweetLikesCount: tweetLikesCount,
          replyUser: replyUser,
        })
      })
    })
  },
  postTwitter: (req, res) => {
    if (req.body.text.length > 140) {
      req.flash('error_messages', '推文字數限制在 140 以內！')
      res.redirect('back')
    }
    else {
      return Tweet.create({
        UserId: req.user.id,
        content: req.body.text,
        createdAt: new Date(),
        updatedAt: new Date()
      }).then((tweet) => {
        res.redirect('twitters')
      })
    }
  },
  postReply: (req, res) => {

    return Reply.create({
      UserId: req.user.id,
      TweetId: req.params.id,
      content: req.body.text,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then((reply) => {
      res.redirect('back')
    })
  },
}


module.exports = twitterController