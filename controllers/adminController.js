const bcrypt = require('bcryptjs')
const { Tweet, User } = require('../models')

const adminController = {
  // // 管理者可從專門的後台登入頁面進入網站後台
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res) => {
    return Tweet.findAll({ raw: true, nest:true, }).then(tweets => {
      return res.render('admin/tweets', { tweets: tweets })
    })
  },

  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then((tweet) => {
            res.redirect('/admin/tweets')
          })
      })
  },

  // deleteTweet: async (req, res, callback) => {
  //   let tweet = await Tweet.findByPk(req.params.id, {
  //     include: [
  //       User,
  //       { model: User }
  //     ]
  //   })
  //   tweet.destroy()
  //   callback({
  //     status: 'success', message: 'tweet deleted'})
  //   },

  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.render('admin/users', { users })
    })
  },
}

module.exports = adminController



// 管理者可以瀏覽全站的 Tweet 清單
// 可以直接在清單上快覽 Tweet 的前 50 個字
// 可以在清單上直接刪除任何人的推文
// 管理者可以瀏覽站內所有的使用者清單，清單的資訊包括
// 使用者社群活躍數據，包括推文(tweet) 數量、關注人數、跟隨者人數、推文被 like 的數量
// 清單預設按推文數排序