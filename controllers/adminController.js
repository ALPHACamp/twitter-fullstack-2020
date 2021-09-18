const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (!req.user.role) {
      req.flash('error_messages', '帳號或密碼錯誤')

      res.redirect('/admin/signin')
    } else {
      req.flash('success_messages', '成功登入後台！')
      res.redirect('/admin/tweets')
    }
  },
  tweets: (req, res) => {
    return res.render('admin/tweets')
  },

  logOut: (req, res) => {
    req.flash('success_messages', '成功登入！')
    req.logOut()
    res.redirect('admin/signin')
  },
  getTweets: async (req, res) => {
    let tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      attributes: ['id', 'description', 'createdAt'],
      include: {
        model: User,
        attributes: ['id', 'name', 'account', 'avatar'],
        where: { role: 0 }
      }
    })
    tweets = tweets.map(data => ({
      ...data,
      description:
        data.description.length < 50
          ? data.description
          : data.description.substring(0, 50) + '...'
    }))
    return res.render('admin/tweets', { tweets })
  },

  deleteTweet: async (req, res) => {
    const id = req.params.tweetid
  },
  getUsers: (req, res) => {
    return res.render('admin/users')
  }
}

module.exports = adminController
