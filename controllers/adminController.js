const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  adminSigninPage: (req, res) => {
    res.render('admin/adminSigninPage')
  },
  // 管理者進入passport前檢查關卡
  adminCheckRequired: (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      req.flash('error_messages', '請輸入帳號密碼！')
      return res.redirect('/admin/signin')
    }
    return next()
  },
  // 管理者成功登入後訊息提示
  adminSigninSuccess: (req, res) => {
    req.flash('success_messages', '登入成功！')
    res.redirect('/admin/tweets')
  },
  adminTweetsPage: (req, res) => {
    Tweet.findAll({ raw: true, nest: true, include: [User], order: [['createdAt', 'DESC']] })
      .then(tweets => {
        const data = tweets.map(tweets => ({
          ...tweets,
          description: tweets.description.substring(0, 50)
        }))
        return data
      })
      .then(data => {
        res.render('admin/adminTweetsPage', { tweets: data })
      })
      .catch(err => console.log(err))
  },
  adminDeleteTweets: (req, res) => {
    const { tweetId } = req.params
    Tweet.findByPk(tweetId)
      .then(tweet => tweet.destroy())
      .then(() => {
        req.flash('success_messages', '成功刪除文章！')
        res.redirect('/admin/tweets')
      })
      .catch(err => res.send(err))
  },
  adminUsersPage: (req, res) => {
    User.findAll({ raw: true, nest: true })
      .then(users => res.render('admin/adminUsersPage', { users })
      )
      .catch(err => console.log(err))
  }
}

module.exports = adminController
