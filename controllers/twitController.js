const bcrypt = require('bcryptjs')
const { text } = require('body-parser')
const db = require('../models')
const Followship = db.Followship
const User = db.User
const Tweet = db.Tweet
const helper = require('../_helpers')
const fs = require('fs')
const Reply = db.Reply
const Like = db.Like

const twitController = {

  getTwitters: (req, res) => {
    const userId = req.user.id
    Promise.all([
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
        include: [User]
      }),
      User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Like.findAll({
        raw: true,
        nest: true,
        include: [User, Tweet]
      }),
      Reply.findAll({
        raw: true,
        nest: true,
      })
    ]).then(([tweet, users, likes, replys]) => {
      const userself = req.user.id
      users = users.map(user => ({// 整理 users 資料
        ...user.dataValues,
        FollowerCount: user.Followers.length,// 計算跟隨者/跟隨中人數
        FollowingCount: user.Followings.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)// 判斷目前登入使用者是否已追蹤該 User 物件
      }))
      helper.removeUser(users, userself)//移除使用者自身資訊
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單

      tweet = tweet.map(bb => {
        const replyCount = replys.filter(reply => {

          return reply.TweetId === bb.id
        })

        const likeCount = likes.filter(like => {

          return like.TweetId === bb.id
        })
        likes.filter(like => {
          if (like.TweetId === bb.id) {
            if (like.UserId === userId) {
              bb.likeBoolean = true
            }
          }
        })
        bb.replyCount = replyCount.length
        bb.likeCount = likeCount.length
        // bb.likeBoolean = likeBoolean
        return bb
      })

      console.log(tweet)
      return res.render('userAdmin', { users, tweet, reqAvatar: req.user.avatar })
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
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(users => {
      const userself = req.user.id
      users = users.map(user => ({// 整理 users 資料
        ...user.dataValues,
        FollowerCount: user.Followers.length,// 計算追蹤者人數
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id),// 判斷目前登入使用者是否已追蹤該 User 物件
        //followtime: user.Follower
      }))
      helper.removeUser(users, userself)//移除使用者自身資訊
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單

      //userFollower = users.sort((a, b) => b.followerId - a.followerId)
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
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id),// 判斷目前登入使用者是否已追蹤該 User 物件
        followtime: user.Followers.createdAt
      }))
      helper.removeUser(users, userself)//移除使用者自身資訊
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單
      return res.render('following', { users })
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
          include: [User],
          where: { UserId: userId }
        })
          .then(tweet => {
            User.findByPk(userId, {
              raw: true,
              include: [
                { model: User, as: 'Followers', attributes: ['avatar', 'id'] },
                { model: User, as: 'Followings', attributes: ['avatar', 'id'] },
              ]
            })
            console.log(tweet)
            const tweetLength = tweet.length
            return res.render('user', { users, tweet, tweetLength })
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
                avatar: file ? `/upload/${file.originalname}` : 'https://i.pinimg.com/474x/ff/4f/c3/ff4fc37f314916957e1103a2035a11fa.jpg'
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
    console.log(req.user.role)
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
                avatar: 'https://i.pinimg.com/474x/ff/4f/c3/ff4fc37f314916957e1103a2035a11fa.jpg',
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

  getIdTwitters: (req, res) => {
    Tweet.findByPk(req.params.id, {
      raw: true, include: [User]
    }).then(tweet => {
      return res.json({
        tweetData: tweet
      })
    })
  },

  twitterReplies: (req, res) => {
    Reply.create({
      UserId: req.body.userId,
      TweetId: req.body.tweetId,
      comment: req.body.comment,
    }).then(reply => {
      req.flash('success_messages', '成功回覆訊息！')
      return res.redirect(`/tweets/${req.body.tweetId}/replies`)
    })
  },
  getIdReplies: (req, res) => {
    console.log(req.params.id)
    Reply.findAll({
      order: [['createdAt', 'ASC']],
      where: { TweetId: req.params.id },
      nest: true,
      raw: true,
      include: [
        User,
        { model: Tweet, include: [User] }
      ]
    }).then(replys => {
      Tweet.findByPk(req.params.id, {
        nest: true,
        raw: true,
        include: [User]
      }).then(tweet => {

        console.log(replys)

        return res.render('replyUser', { replys: replys, tweet: tweet, replysLength: replys.length })
      })

    })

  },

  postLike: (req, res) => {
    // console.log(req.params.userId)
    // console.log(req.params.tweetId)
    const userId = req.params.userId
    const tweetId = req.params.tweetId
    Like.findOne({
      // raw: true,
      where: { userId: userId, tweetId: tweetId }
    }).then(like => {
      if (like) {
        // console.log('有找到一樣的, 準備刪除')
        like.destroy()
          .then(() => {
            res.json({ status: 'ok', message: '刪除Like推文成功' })
          })
      } else {
        // console.log('沒有有找到一樣的, 準備進行like')
        Like.create({
          UserId: userId,
          TweetId: tweetId,
        })
          .then(() => {
            res.json({ status: 'ok', message: 'Like推文成功' })
          })
      }
    })
  },

  getchatroomPublic: (req, res) => {
    return res.render('chatroom')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }


}
module.exports = twitController