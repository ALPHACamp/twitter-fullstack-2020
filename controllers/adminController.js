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
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        userAvatar: t.dataValues.User.avatar,
        userName: t.dataValues.User.name,
        userAccount: t.dataValues.User.account,
        tweetDescription: t.dataValues.description.substring(0, 50),
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
      .then(tweet => {
        tweet.destroy()
      })
      .then(() => {
        res.redirect('back')
      })
  },

  // admin get all users
  getUsers: (req, res) => {
    // user.cover, user.avatar, user.name, user.account
    // user.tweetTotal, 貼文被喜歡的total, 
    // 追蹤人數 , 被追蹤人數
    return User.findAll({
      where: { role: 'normal' },
      include: [
        Tweet,
        // { model: User, as: 'LikedUsers' ,raw: true, nest: true},
        { model: Tweet, as: 'LikedTweets', raw: true, nest: true },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {

        users = users.map(user => {
          if (user.dataValues !== undefined) {
            return {
              ...user.dataValues,
              userCover: user.cover,
              userAvatar: user.avatar,
              userName: user.name,
              userAccount: user.account,
              userTweetTotal: user.Tweets.length,
              userTweetLikedTotal: user.LikedTweets.length,
              userFollowingsTotal: user.Followings.length,
              userFollowersTotal: user.Followers.length
            }
          }
        })
        users = users.sort((a, b) => b.userTweetLikedTotal - a.userTweetLikedTotal)
        return res.render('admin/users', { users })
      })
  },

  // getUsers: (req, res) => {
  //   // user.cover, user.avatar, user.name, user.account
  //   // user.tweetTotal, 貼文被喜歡的total, 
  //   // 追蹤人數 , 被追蹤人數
  //   return User.findAll({
  //     where: { role: 'normal' },
  //     include: [
  //       Tweet,
  //       { model: User, as: 'Followings' },
  //       { model: User, as: 'Followers' }
  //     ]
  //   })
  //     .then(users => {
  //       Tweet.findAll({
  //         include: [
  //           { model: User, as: 'likedUsers', raw: true, nest: true }
  //         ]
  //       })
  //         .then(items => {
  //           users = users.map(user => {
  //             if (user.dataValues !== undefined) {
  //               return {
  //                 ...user.dataValues,
  //                 userCover: user.cover,
  //                 userAvatar: user.avatar,
  //                 userName: user.name,
  //                 userAccount: user.account,
  //                 userTweetTotal: user.Tweets.length,
  //                 userFollowingsTotal: user.Followings.length,
  //                 userFollowersTotal: user.Followers.length
  //               }
  //             }
  //           })
  //           items = items.map(item => {
  //             if (item.dataValues !== undefined) {
  //               return {
  //                 ...item.dataValues,
  //                 userTweetLikedTotal: item.LikedTweets.length,
  //               }
  //             }
  //           })
  //           return res.render('admin/users', { users, items })
  //         })
  //     })
  // },

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