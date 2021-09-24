const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

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
        isLiked: req.user.LikedTweets.map(d => d.id).includes(row.id)
      }))
      return res.render('tweet', {
        tweets: tweetData,
      })
    })
  },
  getTweet: (req, res) => {
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
          replies: replies,
        })
      })
    })
  },
  postTweet: (req, res) => {
    if (req.body.text.length > 140) {
      req.flash('error_messages', '推文字數限制在 140 以內！')
      res.redirect('back')
    }
    else {
      return Tweet.create({
        UserId: req.user.id,
        description: req.body.text,
        createdAt: new Date(),
        updatedAt: new Date()
      }).then((tweet) => {
        res.redirect('tweet')
      })
    }
  },
  postReply: (req, res) => {

    return Reply.create({
      UserId: req.user.id,
      TweetId: req.params.id,
      comment: req.body.text,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then((reply) => {
      res.redirect('back')
    })
  },
  like: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.id
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  unlike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        like.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  },
  following: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.id
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  unfollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.id
      }
    })
      .then(Followship => {
        Followship.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  },
}


module.exports = tweetController