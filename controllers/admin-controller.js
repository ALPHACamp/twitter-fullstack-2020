const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'admin 成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getTweets: (req, res, next) => {
    // 管理者頁面的推文抓取
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Like, Reply],
      raw: true,
      nest: true
    })
      .then(tweets => {
        return res.render('admin/tweets', {
          tweets
        })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("tweet didn't exist!'")
        return tweet.destroy()
      })
      .then(() =>
        res.redirect('/admin/tweets')
      )
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    // res.render('admin/users')
    return User.findAll({
      attributes: [
        'id', 'name', 'email', 'avatar', 'account', 'background'
      ],
      include: [
        { model: Tweet },
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        tweetCount: user.Tweets.length,
        likeCount: user.LikedTweets.length,
        followingCount: user.Followings.length,
        followerCount: user.Followers.length
      }))
      users = users.sort((a, b) => b.tweetCount - a.tweetCount)
      console.log(users.tweetCount)
      return res.render('admin/users', {
        users
      })
    })
      .catch(next)
  }
}
module.exports = adminController
