const db = require('../models')
const tweet = require('../models/tweet')
const Tweet = db.Tweet
const Like = db.Like
const User = db.User
const Reply = db.Reply
const Followship = db.Followship

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      //where: {UserId: '$User.dataValues.Followings.id$'},
       include: [
        Like,
        Reply,
        { model: User, include: [{ model: User, as: 'Followers'}]}]
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
      return res.render('tweets', { tweetFollowings })
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
  }
}

module.exports = tweetController