const bcrypt = require('bcryptjs')
const { text } = require('body-parser')
const db = require('../models')
const Followship = db.Followship
const User = db.User
const Tweet = db.Tweet
const helper = require('../_helpers')
const fs = require('fs')


const twitController = {

  getTwitters: (req, res) => {
    // 撈出所有 User 與 followers 資料
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      include: [User]
    }).then(tweet => {
      //console.log(tweet)加入 console 觀察資料的變化
      // console.log(tweet) // 加入 console 觀察資料的變化
      User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }).then(users => {
        const userself = req.user.id
        users = users.map(user => ({// 整理 users 資料
          ...user.dataValues,
          FollowerCount: user.Followers.length,// 計算跟隨者/跟隨中人數
          FollowingCount: user.Followings.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)// 判斷目前登入使用者是否已追蹤該 User 物件
        }))
        helper.removeUser(users, userself)//移除使用者自身資訊
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單
        return res.render('userAdmin', { users, tweet, reqAvatar: req.user.avata })
      })
    })

  },

  toTwitters: (req, res) => {
    //console.log(req.user.id)
    //console.log(req.body)
    return Tweet.create({
      UserId: Number(req.user.id),
      description: req.body.description,
    })
      .then((tweet) => {
        req.flash('success_messages', 'tweet was successfully created')
        res.redirect('/')
      })
  },

  putTwitters: (req, res) => {
    // Tweet.find
    return res.render('userAdmin')
  },


  //follow function
  getFollower: (req, res) => {
    return User.findAll({// 撈出所有 User 與 followers 資料
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      const userself = req.user.id
      users = users.map(user => ({// 整理 users 資料
        ...user.dataValues,
        FollowerCount: user.Followers.length,// 計算追蹤者人數
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)// 判斷目前登入使用者是否已追蹤該 User 物件
      }))
      helper.removeUser(users, userself)//移除使用者自身資訊
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單
      return res.render('follower', { users })
    })
  },

  getFollowing: (req, res) => {
    return User.findAll({// 撈出所有 User 與 followers 資料
      //order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(users => {
      const userself = req.user.id
      users = users.map(user => ({ // 整理 users 資料
        ...user.dataValues,
        FollowerCount: user.Followers.length,// 計算追蹤者人數
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)// 判斷目前登入使用者是否已追蹤該 User 物件
      }))
      helper.removeUser(users, userself)//移除使用者自身資訊
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單

      Followship.findAll({
        order: [['createdAt', 'DESC']]
      }).then(followtime => {
        return res.render('following', { users, followtime })
      })
    })
  },

  toFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  deleteFollowing: (req, res) => {
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




  getUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers', attributes: ['avatar', 'id'] },
        { model: User, as: 'Followings', attributes: ['avatar', 'id'] },
      ]
    })
      .then(users => {
        const userself = req.user.id
        users = users.map(user => ({// 整理 users 資料
          ...user.dataValues,
          FollowerCount: user.Followers.length,// 計算追蹤者人數
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id),// 判斷目前登入使用者是否已追蹤該 User 物件
        }))
        helper.removeUser(users, userself)//移除使用者自身資訊
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單

        const userId = req.user.id //撈出所有Tweet及單筆使用者的資料
        Tweet.findAll({
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true,
          include: [User]
        })
          .then(tweet => {
            User.findByPk(userId, {
              raw: true,
              include: [
                { model: User, as: 'Followers', attributes: ['avatar', 'id'] },
                { model: User, as: 'Followings', attributes: ['avatar', 'id'] },
              ]
            })
            return res.render('user', { users, tweet })
          })
      })

  },



  toUser: (req, res) => {

    const userId = req.user.id
    const { file } = req // equal to const file = req.file

    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          User.findByPk(userId)
            .then((user) => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                avatar: file ? `/upload/${file.originalname}` : null
              })
                .then(() => {
                  req.flash('success_messages', 'user was successfully to update')
                  res.redirect('/user/self')
                })
            })
        })
      })
    } else {
      User.findByPk(userId)
        .then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: null
          })
            .then(() => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect('/user/self')
            })
        })
    }
  },

  getUserLike: (req, res) => {
    return User.findAll({ // 撈出所有 User 與 followers 資料
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      const userself = req.user.id
      users = users.map(user => ({// 整理 users 資料
        ...user.dataValues,
        FollowerCount: user.Followers.length,// 計算追蹤者人數
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)// 判斷目前登入使用者是否已追蹤該 User 物件
      }))
      helper.removeUser(users, userself)//移除使用者自身資訊
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單
      return res.render('userLike', { users })
    })
  },

  getReplies: (req, res) => {

    return User.findAll({// 撈出所有 User 與 followers 資料
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      const userself = req.user.id
      users = users.map(user => ({ // 整理 users 資料
        ...user.dataValues,
        FollowerCount: user.Followers.length,// 計算追蹤者人數
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)// 判斷目前登入使用者是否已追蹤該 User 物件
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單
      return res.render('replyUser', { users })
    })
  },

  toReplies: (req, res) => {
    return res.render('toReplies')
  },

  // 個人資料頁面推文與回覆
  getUserReplies: (req, res) => {
    return res.render('userReplies')
  },

  signin: (req, res) => {
    return res.render('signin')
  },

  toSignin: (req, res) => {
    if (req.user.role) {
      req.flash('error_messages', '帳號或密碼錯誤')
      res.redirect('/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/')
    }

  },

  getSignup: (req, res) => {
    res.render('signup')
  },

  toSignup: (req, res) => {
    //console.log(req.body)
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複！')
              return res.redirect('/signup')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
            }

          })
        }
      })
    }
  },

  getSetting: (req, res) => {
    //console.log(req.user.id)
    const userId = req.user.id
    User.findByPk(userId, { raw: true }).then(user => {
      res.render('setting', { userdata: user })

    })
  },

  putSetting: (req, res) => {
    //console.log(req.user.id)
    const userId = req.user.id

    // confirm password()
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/setting')
    } else {
      User.findByPk(userId)
        .then((user) => {
          user.update({
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),

          })
            .then(() => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect('/setting')
            })
        })
    }
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }


}
module.exports = twitController