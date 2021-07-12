const { Tweet, User, Reply, Like } = require('../models')

const tweetService = {
  getTweets: async (req, res, callback) => {
    let tweets = await Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUsers' }
      ]
    })
    tweets = tweets.map(t => ({
      ...t.dataValues,
      User: t.User.dataValues,
      LikedCount: t.LikedUsers.length,
      ReplyCount: t.Replies.length,
      isLiked: req.user.LikedTweets.map(t => t.id).includes(t.dataValues.id)
    }))
    return callback({
      tweets,
      Appear: { navbar: true, top10: true },
    })
  },
  getTweet: async (req, res, callback) => {
    let tweet = await Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] },
        { model: User, as: 'LikedUsers' }
      ]
    }).then(tweet => {
      const isLiked = tweets.LikedUsers.map(d => d.id).includes(req.user.id)
      return callback({
        tweet: tweet,
        isLiked: isLiked,
      })
    })
    tweet = {
      ...tweet.toJSON(),
      LikedCount: tweet.LikedUsers.length,
      ReplyCount: tweet.Replies.length,
      isLiked: req.user.LikedTweets.map(t => t.id).includes(tweet.id)
    }
    return callback({
      tweet,
      Appear: { navbar: true, top10: true },
    })
  },
  postTweet: async (req, res, callback) => {
    if (!req.body.description) {
      return callback({ status: 'error', message: 'description empty!' })
    }
    if (req.body.description.length > 140) {
      return callback({ status: 'error', message: 'description size should be smaller than 140!' })
    }
    await Tweet.create({
      UserId: req.user.id,
      description: req.body.description
    })
    return callback({ status: 'success', message: 'tweet has been created successfully!' })
  },
  postReply: async (req, res, callback) => {
    if (!req.body.comment) {
      return callback({ status: 'error', message: 'comment empty!' })
    }
    if (req.body.comment.length > 140) {
      return callback({ status: 'error', message: 'comment size should be smaller than 140!' })
    }
    const reply = await Reply.create({
      UserId: req.user.id,
      TweetId: req.params.id,
      comment: req.body.comment
    })
    console.log('controller/userController/line96...reply', reply)
    return callback({ status: 'success', message: 'reply has been created successfully!' })
  }
}

module.exports = tweetService