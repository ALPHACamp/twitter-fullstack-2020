const db = require('../models')
const User = db.User
const Reply = db.Reply
const Tweet = db.Tweet
const Like = db.Like

const adminController = {
  signInPage: (req, res) => res.render('admin/signin'),
  signIn: (req, res) => {
    req.flash('successMessages', '登入成功')
    res.redirect('/admin/tweets')
  },
  getUsers: (req, res) => {
    return User.findAll({
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Reply, include: Tweet },
        { model: Like, include: Tweet }
      ]
    })
      .then(result => {
        const data = result.map(item => ({
          ...item.dataValues,
          followingsCount: item.Followings.length,
          followersCount: item.Followers.length,
          likesCount: item.Likes.length,
          repliesCount: item.Replies.length
        }))
        const users = data.sort((a, b) => b.Tweets.length - a.Tweets.length)

        res.render('admin/users', { users })
      })
  },
  getTweets: (req, res) => {
    return Tweet.findAll({ include: [User] })
      .then(tweets => {
        tweets = tweets.map(item => ({
          ...item.dataValues,
          description: item.description.substring(0, 50)
        }))
        res.render('admin/tweets', { tweets })
      })
  },
  deleteTweet: (req, res) => {
    const id = req.params.id
    return Tweet.findById(id, { include: [Reply] })
      .then(tweet => {
        if (tweet.Replies.length !== 0) { tweet.Replies.destroy() }
        tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
  }
}

module.exports = adminController