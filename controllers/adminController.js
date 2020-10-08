const helpers = require('../_helpers')
const db = require('../models')
const reply = require('../models/reply')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [User],
      order: [['createdAt', 'DESC']]
    }).then(data => {
      const tweets = data.map(item => ({
        ...item.dataValues,
        description: item.dataValues.description.substring(0, 50)
      }))
      // res.json({ tweets })
      res.render('admin/tweets', { tweets: tweets })
    })
  },
  getUsers: (req, res) => {
    return User.findAll({
      include: [
        Tweet,
        Reply,
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(results => {
      const data = results.map(item => ({
        ...item.dataValues,
        LikesCount: item.dataValues.LikedTweets.length,
        TweetsCount: item.dataValues.Tweets.length,
        followersCount: item.dataValues.Followers.length,
        followingsCount: item.dataValues.Followings.length,
        // RepliesCount: item.dataValues.Replies.length,
      }))
      const users = data.sort((a, b) => b.TweetsCount - a.TweetsCount)
      res.render('admin/users', { users })
    })
  },
  deleteTweet: async (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      const id = Number(req.params.id)

      await Tweet.findByPk(id).then(tweet => {
        if (tweet !== null) {
          tweet.destroy()
        }
      }).catch(err => console.log(err))

      await Reply.destroy({ where: { TweetId: id } }).then(reply => {
        console.log('reply destroy ok')
      }).catch(err => console.log(err))

      await Like.destroy({ where: { TweetId: id } }).then(like => {
        console.log('like destroy ok')
      }).catch(err => console.log(err))

      return res.redirect('/admin/tweets')
    }
  }
}

module.exports = adminController