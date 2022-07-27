const { sequelize, Sequelize, User, Tweet, Like } = require('../models')

const adminController = {
  signinPage: (req, res, next) => {
    res.render('admin_signin')
  },

  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res, next) => {
    Tweet.findAll({ include: User, raw: true, nest: true }).then(tweets => {
      const result = tweets.map(tweet => {
        return {
          ...tweet,
          description: tweet.description.substring(0, 50)
        }
      })
      // res.send(tweets)
      res.render('admin_tweets', { tweets: result })
    })
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => {
        res.redirect('back')
      })
  },

  getUsers: (req, res, next) => {
    User.findAll({
      where: { role: 'user' },
      nest: true,
      include: [
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(users => {
      const result = users
        .map(user => {
          return {
            ...user.toJSON(),
            tweetsCount: user.Tweets.length,
            likesCount: user.Tweets.reduce((acc, cur) => acc + cur.Likes.length, 0),
            followersCount: user.Followers.length,
            followingsCount: user.Followings.length
          }
        })
        .sort((a, b) => b.tweetsCount - a.tweetsCount)
      // res.send(result)
      res.render('admin_users', { users: result })
    })
  }
}

module.exports = adminController
