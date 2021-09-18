const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  //登入登出
  signinPage: (req, res) => {
    return res.render('admin/adminSignIn')
  },
  signin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  //貼文相關
  //顯示所有貼文
  getTweets: (req, res) => {
    return Tweet.findAll({ 
      raw: true, 
      nest: true, 
      include: [User]
    })
      .then(tweet => {
        tweet = tweet.map( r => ({ 
          ...r.dataValues,
          User: r.User,
          id:r.id,
          updatedAt: r.updatedAt,
          description: r.description.substring(0, 50),
        }))
        return res.render('admin/adminTweets', { tweet: tweet })
      }) 
  },
  //刪除貼文
  deleteTweets: (req, res) => {
    return Tweet.findByPk(req.params.id)
    .then((tweet) => {
      tweet.destroy()
    })
    .then((tweet) => {
      res.redirect('/admin/tweets')
    })
  },
  //使用者清單
  getUsers: (req, res) => {
    return User.findAll( {raw: true} )
    .then(user => {
      res.render('admin/adminUsers', {user:user})
    })
    
  }
}

module.exports = adminController