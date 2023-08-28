const { User, Tweet, Like } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (req.user.role === 'user') {
      req.flash('error_messages', '帳號不存在！')
      res.redirect('/admin/signin')
    } else {
      req.flash('success_messages', '成功登入')
      res.redirect('/admin/tweets')
    }
  },
  logOut: (req, res) => {
    req.flash('success_messages', '成功登出')
    res.redirect('/signin')
  },
  getTweets: (req, res, next) => {
    const tweetRoute = true
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['created_at', 'DESC']
      ]
    })
      .then(tweets => {
        if (!tweets) throw new Error('Tweets do not exist!')
        res.render('admin/tweets', { tweets, tweetRoute })
      })
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    const userRoute = true
    return User.findAll({
      attributes: [
        'id', 'account', 'name', 'email', 'avatar', 'cover', 'role'
      ],
      include: [
        { model: Tweet },
        { model: Like, as: 'LikedTweets' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ],
      where: {
        role: 'user'
      }
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          tweetsCount: user.Tweets.length,
          likesCount: user.LikedTweets.length,
          followingsCount: user.Followings.length,
          followersCount: user.Followers.length
        }))
        console.log(users)
        users = users.sort((a, b) => b.tweetsCount - a.tweetsCount)
        res.render('admin/users', { users, userRoute })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
