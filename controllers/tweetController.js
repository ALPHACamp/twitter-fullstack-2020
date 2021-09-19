const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          Reply,
          User,
          Like
        ],
        order: [['createdAt', 'DESC']]
      })
      const reorganizationTweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        userAvatar: tweet.User.avatar,
        replyLength: tweet.Replies.length,
        likeLength: tweet.Likes.length,
        isLiked: req.user.LikedTweets.map(likeTweet => likeTweet.id).includes(tweet.id)
      }))
      return res.render('tweets', { reorganizationTweets })
    } catch(err) {
      console.warn(err)
    }
  }, 
  addTweet: async (req, res) => {
    try {
      const { description } = req.body
      if (!description) {
        req.flash('error_messages', '內文不可空白')
        return res.json({ status: 'error', message: '內文不可空白' })
      }
      if (description.length > 140) {
        req.flash('error_messages', '內文不可超過140字')
        return res.json({ status: 'error', message: '內文不可超過140字' })
      }
      const tweet = await Tweet.create({
        description,
        UserId: req.user.id
      })
      return res.redirect('/tweets')
    } catch(err) {
      console.warn(err)
    }   
  },
  getTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId, {
        include: [
          { model: Reply, include: [User] },
          User,
          Like
        ]
      })
      // console.log('getTweet:', tweet)
      // console.log('getTweet Replies user:', tweet.Replies[0].dataValues)
      const tweetJson = tweet.toJSON()
      const tweetReplies = tweetJson.Replies.map(reply => ({
        ...reply
      }))
      // console.log('getTweet reply:', tweetReplies)
      res.render('tweet', { tweetReplies, tweet: tweetJson })
    } catch(err) {
      console.warn(err)
    }
  }, 
  postReplies: async (req, res) => {
    try {
      const { comment } = req.body
      console.log(comment)
      if (!comment) {
        req.flash('error_messages', '內文不可空白')
        return res.json({ status: 'error', message: '內文不可空白' })
      }
      const reply = await Reply.create({
        comment,
        UserId: req.user.id,
        TweetId: req.params.tweetId
      })
      return res.redirect(`/tweets/${req.params.tweetId}/replies`)
    } catch(err) {
      console.warn(err)
    }
    
  },
  addLike: async (req, res) => {
    try {
      await Like.create({
        UserId: req.user.id,
        TweetId: req.params.tweetId
      })
      return res.json({status: 'success', message: 'add likes'})
    } catch(err) {
      console.warn(err)
    }
  }, 
  removeLike: async (req, res) =>{
    try {
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId: req.params.tweetId
        }
      })
      await like.destroy()
      return res.json({ status: 'success', message: 'remove likes' })
    } catch(err) {
      console.warn(err)
    }
  }
}

module.exports = tweetController