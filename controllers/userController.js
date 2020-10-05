const bcrypt = require('bcryptjs')
const db = require('../models')
const tweetController = require('./tweetController')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const helpers = require('../_helpers')
const Like = db.Like

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同，請重新填寫')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', 'email重複!')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複!')
              return res.redirect('/signup')
            } else {
              User.create({
                email: req.body.email,
                name: req.body.name,
                account: req.body.account,
                role: 'user',
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(() => {
                return res.redirect('/signin')
              })
            }
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    console.log(req.user.role)
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getRecommendedFollowings: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      users = users.filter(user => (user.role === "user" && user.name !== helpers.getUser(req).name))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 6)
      res.locals.users = users
      return next()
    })
  },

  getUserTweets: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ], order: [[Tweet, 'createdAt', 'DESC']]
    }).then(user => {
      // console.log(user.Tweets)
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id
      pageUser.isFollowed = helpers.getUser(req).Followers.map(item => item.id).includes(user.id)

      // // 不確定能否撈到 tweet 資料
      // pageUser.Tweets.forEach(tweet => {
      //   tweet.isLiked = tweet.Likes.map(item => item.id).includes(currentUserId)
      // })

      return res.render('user/userPage', {
        users: pageUser,
        currentUserId
      })
    })
  },

  getUserLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: Like, include: [{ model: Tweet, include: User }] },
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }]
      // ], order: [[LikedTweets, 'createdAt', 'DESC']]
    }).then(user => {
      // console.log(user.dataValues)
      // console.log(user.dataValues)
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id
      pageUser.isFollowed = helpers.getUser(req).Followers.map(item => item.id).includes(currentUserId)

      // 缺少 like 清單

      return res.render('user/userLikesPage', { users: user.toJSON() })
    })
  },

  // 取得 追蹤使用者 的清單
  getUserFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' }
      ]
    }).then(user => {
      const pageUser = user.toJSON()
      // console.log('pageUser', pageUser)
      followerList = user.Followers.map(user => ({
        ...user.dataValues,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      // console.log('followerList', followerList)
      return res.render('user/followerPage', {
        users: pageUser,
        followerList
      })
    })
  },

  // 取得 被使用者追蹤 的清單
  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followings' }
      ]
    }).then(user => {
      // console.log(user.dataValues)
      const pageUser = user.toJSON()
      followingList = user.Followings.map(user => ({
        ...user.dataValues,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      // console.log('followingList', followingList)
      return res.render('user/followingPage', {
        users: pageUser,
        followingList
      })
    })
  },

  addFollowing: (req, res) => {
    const currentUserId = helpers.getUser(req).id
    const followingUser = Number(req.params.userId)

    if (currentUserId === followingUser) {
      req.flash('error_messages', '請嘗試追蹤別人吧！')
      return res.redirect('back')
    } else {
      return Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
        .then((followship) => {
          return res.redirect('back')
        })
    }
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  },

  getUserReplies: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: Like, include: [{ model: Tweet, include: User }] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' },
        { model: Reply, include: [User] }
      ], order: [['Replies', 'createdAt', 'DESC']]
    }).then(user => {
      // console.log(user.dataValues)
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id
      pageUser.isFollowed = helpers.getUser(req).Followers.map(item => item.id).includes(currentUserId)

      return res.render('user/userReplyPage', { users: user.toJSON() })
    })
  }
}

module.exports = userController