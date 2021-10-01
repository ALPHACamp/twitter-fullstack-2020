const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res) => {
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
        tweetDescription: row.description,
        tweetRepliesCount: row.Replies.length,
        tweetLikesCount: row.Likes.length,
        isLiked: helpers.getUser(req).LikedTweets ?
          helpers.getUser(req).LikedTweets.map(d => d.id).includes(row.id) : false
      }))
      return res.render('tweet', {
        tweets: tweetData,
      })
    })
  },
  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, {
      include: [
        Reply,
        Like,
        User
      ]
    }).then(tweet => {
      const tweetUser = tweet.dataValues.User.dataValues
      const tweetRepliesCount = tweet.dataValues.Replies.length
      const tweetLikesCount = tweet.dataValues.Likes ?
        tweet.dataValues.Likes.length : fales
      const isLiked = helpers.getUser(req).LikedTweets ?
        helpers.getUser(req).LikedTweets.map(d => d.id).includes(tweet.dataValues.id) : false
      const whereQuery = {}
      whereQuery.tweetId = Number(req.params.id)
      Reply.findAndCountAll({
        order: [['createdAt', 'DESC']],
        include: [
          User
        ],
        where: whereQuery,
      }).then(reply => {
        const replies = reply.rows
        return res.render('replyList', {
          tweet: tweet,
          tweetUser: tweetUser,
          tweetRepliesCount: tweetRepliesCount,
          tweetLikesCount: tweetLikesCount,
          isLiked: isLiked,
          replies: replies,
        })
      })
    })
  },
  postTweet: (req, res) => {
    if (req.body.description.length > 140) {
      req.flash('error_messages', '推文字數限制在 140 以內！')
      return res.redirect('/tweets')
    }
    else {
      Tweet.create({
        UserId: helpers.getUser(req).id,
        description: req.body.description,
        createdAt: new Date(),
        updatedAt: new Date()
      }).then((tweet) => {
        res.status(200)
        return res.redirect('/tweets')
      })
    }
  },
  postReply: (req, res) => {
    Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id,
      comment: req.body.comment,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then((reply) => {
      res.redirect(`/tweets/${req.params.id}/replies`)
    })
  },
  like: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  unlike: (req, res) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy()
        .then(() => {
          return res.redirect('back')
        })
    })
  },
}


module.exports = tweetController