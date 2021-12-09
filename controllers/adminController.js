const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

const adminController = {
  signInPage: (req, res) => {
    if (res.locals.user) {
      delete res.locals.user
    }
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '成功登入！')
    res.redirect('/admin/tweets')
  },

  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['createdAt', 'DESC']
      ]
    })
      .then(tweets => {
        const data = tweets.map(r => {
          r.description = r.description.substring(0, 50)
          return r
        })
        return res.render('admin/tweets', { tweets: data })
      })
  },

  getUsers: (req, res) => {
    return User.findAll({
      where: { role: 'user' },
      include: [
        Reply,
        { model: Tweet, as: 'LikedTweets', raw: true, nest: true },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ],
    })
      .then(users => {
        
        users = users.map(user => {
          if (user.dataValues !== undefined) {
            return {
              ...user.dataValues,
              replyCount: user.Replies.length,
              likeCount: user.LikedTweets.length,
              followingCount: user.Followings.length,
              followerCount: user.Followers.length
            }
          }
        })
        
        return res.render('admin/users', { users })
      })
  },

  deleteTweets: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then((tweet) => {
            res.redirect('/admin/tweets')
          })
      })
  }
}

module.exports = adminController