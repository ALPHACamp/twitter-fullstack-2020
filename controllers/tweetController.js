const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like
const User = db.User
const Reply = db.Reply
const ReplyComment = db.ReplyComment

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
       include: [
        Like,
        Reply,
        { model: User, include: [{ model: User, as: 'Followers'}]}],
        order: [['updatedAt', 'DESC']]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        likesCount: tweet.dataValues.Likes.length,
        repliesCount: tweet.dataValues.Replies.length,
        user: tweet.dataValues.User.dataValues,
        FollowerId: tweet.dataValues.User.dataValues.Followers.map(Followers => Followers.dataValues.id)
      }))

      //filter the tweets to those that user followings & user himself
      tweetFollowings = []
      tweets.forEach(tweets => {
        tweets.FollowerId.forEach(FollowerId => {
          if (FollowerId === req.user.id || tweets.UserId === req.user.id) {
            tweetFollowings.push(tweets)
          }
        })
      })

      user = req.user
      
      return res.render('tweets', { tweetFollowings, user })
    })  
  },

  postTweets: (req, res) => {
    const { description } = req.body
    if (!description) {
      req.flash('error_messages', '貼文不得為空白')
      return res.redirect('/tweets')
    }
    if (description.length > 140) {
      req.flash('error_messages', '貼文字數不得超過140字')
      return res.redirect('/tweets')
    }
    else {
      Tweet.create({
        description,
        UserId: req.user.id
      })
      .then(tweet => {
        return res.redirect('/tweets')
      })
    }
  },

  getTweet: (req, res) => {
    Tweet.findByPk(req.params.tweetId,
      { include: [
        Like, 
        User,
        { model: Reply, include: [ User, Like, ReplyComment ] }
      ] }
    )
    .then(tweet => {
      tweet = tweet.toJSON()
      tweet.Replies.sort((a, b) => {
        return b.updatedAt - a.updatedAt
      })
      user = req.user
      return res.render('tweet', { tweet, user })
    })
  },

  postReply: (req, res) => {
    const { comment } = req.body
    if (!comment) {
      req.flash('error_messages', '留言不得為空白')
      return res.redirect(`/tweets/${req.params.tweetId}`)
    }
    else {
      Reply.create({
        UserId: req.user.id,
        TweetId: req.params.tweetId,
        comment
      })
      .then(reply => {
        return res.redirect(`/tweets/${reply.TweetId}`)
      })
    }
  }
}

module.exports = tweetController