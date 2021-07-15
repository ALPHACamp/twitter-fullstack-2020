const bcrypt = require('bcryptjs')
const { Tweet, User } = require('../models')
const adminService = require('../services/adminService')
const { getUser } = require('../_helpers')

const adminController = {
  // // 管理者可從專門的後台登入頁面進入網站後台
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  signIn: (req, res) => {
    if (getUser(req).isAdmin) {
      req.flash('success_messages', '成功登入')
      return res.redirect('/admin/tweets')
    } else {
      req.flash('error_messages', '請使用一般權限')
      return res.redirect('/admin/signin')
    }
  },

  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => {
      return res.render('admin/tweets', data)
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

  getAllUsers: (req, res) => {
    adminService.getAllUsers(req, res, (data) => {
      return res.render('admin/users', data)
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