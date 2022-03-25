const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUsers' }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(t.id)
      }))
      res.render('tweets', {
        user: req.user,
        tweets: data
      })
    })
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      return res.redirect('/')
    }
    return Tweet.create({
      UserId: req.user.id,
      description: req.body.description,
    }).then(tweet => {
      return res.redirect('/')
    })
  },
  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: User, as: 'LikedUsers' },
        { model: Reply, include: [User] }
      ]
    }).then(tweet => {
      res.render('tweet', {
        tweet: tweet.toJSON(),
        isLiked: tweet.LikedUsers.map(d => d.id).includes(req.user.id)
      })
    })
  },
  postReply: (req, res) => {
    Reply.create({
      UserId: req.user.id,
      TweetId: req.params.id,
      comment: req.body.comment
    }).then((reply => {
      res.redirect('back')
    }))
  },
  addLike: (req, res) => {
    Like.create({
      UserId: req.user.id,
      TweetId: req.params.id
    }).then((tweet) => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy()
        .then(tweet => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = tweetController