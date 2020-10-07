const fs = require('fs')
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
      res.locals.recommendedList = users
      return next()
    })
  },
  getSetting: (req, res) => {
    // console.log('helpers.getUser(req).id', helpers.getUser(req).id)
    return res.render('setting')
  },

  putSetting: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    const id = req.params.id

    if (password !== checkPassword) {
      req.flash('error_messages', '請再次確認密碼')
      return res.redirect('back')
    }
    else {
      User.findOne({ where: { email: email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱已註冊')
          return res.redirect('back')
        } else {
          User.findOne({ where: { account: account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號已註冊')
              return res.redirect('back')
            } else {
              return User.findByPk(id)
                .then((user) => {
                  user.update({
                    email: email,
                    name: name,
                    account: account,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                  }).then((user) => {
                    req.flash('success_messages', '成功更新帳號資訊!')
                    return res.redirect('/tweets')
                  })
                })
            }
          })
        }
      })
    }
  },

  getUserTweets: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet,
          include: [
            Reply,
            { model: User, as: 'LikedUsers' }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ], order: [[Tweet, 'createdAt', 'DESC']]
    }).then(user => {
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id

      pageUser.Tweets.forEach(tweet => {
        tweet.isLiked = tweet.LikedUsers.map(d => d.id).includes(currentUserId)
      })
      pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(user.id)

      return res.render('user/userPage', {
        users: pageUser,
        currentUserId: currentUserId
      })
    })
  },

  getUserLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Like,
          include: [
            {
              model: Tweet,
              include: [Reply, Like, User]
            }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ], order: [[Like, 'createdAt', 'DESC']]
    }).then(user => {
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id

      pageUser.Likes.forEach(tweet => {
        tweet.isLiked = tweet.Tweet.Likes.map(d => d.UserId).includes(currentUserId)
      })
      pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(pageUser.id)

      return res.render('user/userLikesPage', {
        users: pageUser,
        currentUserId: currentUserId
      })
    })
  },


  // getUserInfo: (req, res) => {

  // },

  editUser: (req, res) => {
    if (!helpers.getUser(req)) {
      return res.redirect('back')
    } else {
      res.render('partials/userEdit')
    }
  },


  putUserInfo: (req, res) => {
    const { files } = req
    const { name, introduction } = req.body
    const { cover, avatar } = req.files

    if (!name) {
      req.flash('error_messages', "請輸入名稱")
      return res.redirect('back')
    }

    if (name.length > 50) {
      req.flash('error_messages', "名稱不可超過 50 字")
      return res.redirect('back')
    }

    if (introduction.length > 160) {
      req.flash('error_messages', "自我介紹不可超過 160 字")
      return res.redirect('back')
    }

    // res.json(files)
    // 可傳出 path
    // console.log('avatar[0].path', avatar[0].path)

    if (files) {
      if (cover) {
        fs.readFile(cover[0].path, (err, data) => {
          if (err) console.log('Error:', err)
          fs.writeFile(`upload/${files.originalname}`, data, () => {
            return User.findByPk(req.params.id)
              .then((user) => {
                // res.json(user)
                user.update({
                  name: name,
                  introduction: introduction,
                  cover: files ? `/upload/${files.originalname}` : user.cover,
                  // avatar: user.avatar
                }).then((user) => {
                  req.flash('success_messages', 'profile was successfully to update')
                  res.redirect(`/users/${req.params.id}/tweets`)
                })
              })
          })
        })
      } else if (avatar) {
        fs.readFile(avatar[0].path, (err, data) => {
          if (err) console.log('Error:', err)
          fs.writeFile(`upload/${files.originalname}`, data, () => {
            return User.findByPk(req.params.id)
              .then((user) => {
                user.update({
                  name: name,
                  introduction: introduction,
                  avatar: files ? `/upload/${files.originalname}` : user.avatar,
                }).then((user) => {
                  req.flash('success_messages', 'profile was successfully to update')
                  res.redirect(`/users/${req.params.id}/tweets`)
                })
              })
          })
        })
      } else {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: name,
              introduction: introduction,
              cover: user.cover,
              avatar: user.avatar
            }).then((user) => {
              req.flash('success_messages', 'profile was successfully to update')
              res.redirect(`/users/${req.params.id}/tweets`)
            })
          })
      }
    }
  },

  getUserReplies: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Reply,
          include: [
            {
              model: Tweet,
              include: [Reply, Like, User]
            }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ], order: [[Reply, 'createdAt', 'DESC']]
    }).then(user => {
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id

      pageUser.Replies.forEach(tweet => {
        tweet.isLiked = tweet.Tweet.Likes.map(d => d.UserId).includes(currentUserId)
      })
      pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(pageUser.id)

      return res.render('user/userReplyPage', {
        users: pageUser,
        currentUserId: currentUserId
      })
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
    const followingUser = Number(req.body.id)

    if (currentUserId === followingUser) {
      req.flash('error_messages', '請嘗試追蹤別人吧！')
      // return res.redirect('error')
      return res.render('error')
    } else {
      return Followship.create({
        followerId: currentUserId,
        followingId: followingUser
      })
        .then((followship) => {
          return res.redirect('back')
        })
    }
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController