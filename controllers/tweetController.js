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
      console.log('get tweets:', tweets[1].dataValues.User.name)
      const reorganizationTweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        userAvatar: tweet.User.avatar,
        replyLength: tweet.Replies.length,
        likeLength: tweet.Likes.length
      }))
      console.log('mapping tweet:', reorganizationTweets)
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
  getTweet: (req, res) => {

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
  addLike: (req, res) => {

  }, 
  removeLike: (req, res) =>{

  }
}

module.exports = tweetController