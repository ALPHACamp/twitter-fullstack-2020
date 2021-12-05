const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const db = require('../models')
const followship = require('../models/followship')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship


const adminController = {

  // admin signin page
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  // admin index page
  getTweets: (req, res) => {
    // 撈出所有tweet , include user
    // 依序日期排列後
    // 用data去map要用的資料
    // 資料: user的 avatar , name , account , createAt(time) , description
    // 傳給admin/tweets去render
    Tweet.findAll({
      row: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User]
    }).then( tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        userAvatar: t.dataValues.User.avatar,
        userName: t.dataValues.User.name,
        userAccount: t.dataValues.User.account,
        tweetDescription: t.dataValues.description,
        tweetId: t.dataValues.id,
      }))
      // console.log(data[0])
      return res.render('admin/tweets', { tweets: data })
    })
  },

  // admin delete tweet
  deleteTweet: (req, res) => {
    // 去Tweet資料庫findPkBy(設定好的動態id)
    // 找到後刪除
    // 導回admin/tweets
    Tweet.findByPk(req.params.tweetId)
      .then( tweet => {
        tweet.destroy()
      })
      .then(()=>{
        res.redirect('back')
      })
  },

  // admin get all users
  getUsers: (req, res) => {
    // 撈出所有Tweet , include reply、like、followship
    // 依使用者推文數量排序
    // 將需要渲染的資料傳去admin/users
      User.findAll({
      raw: true,
      nest: true,
    })
      .then( users => {
        console.log(users[0])
        return res.render('admin/users', {users})
      })
  },

  //admin signIn
  signin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  // admin logout
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
}

module.exports = adminController