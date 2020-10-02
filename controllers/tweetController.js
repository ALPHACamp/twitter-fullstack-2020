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
      const loginUser = req.user

      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        likesCount: tweet.dataValues.Likes.length,
        repliesCount: tweet.dataValues.Replies.length,
        user: tweet.dataValues.User.dataValues,
        followerId: tweet.dataValues.User.dataValues.Followers.map(followers => followers.dataValues.id),      
        isLiked: req.user.Likes.map(like => like.TweetId).includes(tweet.id)
      }))
          
      //filter the tweets to those that user followings & user himself
      tweetFollowings = []
      tweets.forEach(tweet => {
        if (tweet.UserId === loginUser.id) {
          tweetFollowings.push(tweet)
        }
        tweet.followerId.forEach(followerId => {
          if (followerId === loginUser.id) {
            tweetFollowings.push(tweet)
          }
        })
      })

      //Top 10 followers
      User.findAndCountAll({
        include: [{ model: User, as: 'Followers' }],
        limit: 10
      })
      .then(users => {
        users = users.rows.map(user => ({
          ...user.dataValues,
          isFollowing: user.Followers.map(follower => follower.id).includes(req.user.id)
        }))
        
        //sort by the amount of the followers
        users.sort((a, b) => {
          return b.Followers.length - a.Followers.length
        })
        
        return res.render('tweets', { tweetFollowings, loginUser, users })
      })
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
        { model: Reply, include: [ 
          User, 
          Like, 
          { model: ReplyComment, include: [ User ]} 
        ] }
      ] }
    )
    .then(tweet => {
      tweet = tweet.toJSON()
      const loginUser = req.user
      
      //like and dislike tweet
      const isLikedTweet = req.user.Likes.map(likes => likes.TweetId).includes(tweet.id)

      //like and dislike reply
      tweetReplies = tweet.Replies.map(reply => ({
        ...reply,
        isLikedReply: reply.Likes.map(like => like.UserId).includes(req.user.id)
      }))

      tweet.Replies.sort((a, b) => {
        return b.updatedAt - a.updatedAt
      })

       //Top 10 followers
      User.findAndCountAll({
        include: [{ model: User, as: 'Followers' }],
        limit: 10
      })
      .then(users => {
        users = users.rows.map(user => ({
          ...user.dataValues,
          isFollowing: user.Followers.map(follower => follower.id).includes(req.user.id)
        }))
        
        //sort by the amount of the followers
        users.sort((a, b) => {
          return b.Followers.length - a.Followers.length
        })
        
        return res.render('tweet', { tweet, loginUser, isLikedTweet, tweetReplies, users })
      })
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
  },

  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        tweet.destroy()
          .then(tweet => {
            return res.redirect('/tweets')
          })  
      })
  }
}

module.exports = tweetController