const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'd97de9c03bf7519'
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')

const getLink = (filePath) => {
  return new Promise((resolve, reject) => {
    imgur.setClientID(IMGUR_CLIENT_ID)
    imgur.upload(filePath, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img.data.link)
    })
  })
}

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) {
      req.flash('error_messages', '密碼與檢查密碼不一致！')
      res.redirect('/signup')
    } else {
      return User.findOne({
        where: {
          [Op.or]: [{ account }, { email }]
        }
      })
        .then((user) => {
          if (user) {
            if (user.account === account) { req.flash('error_messages', 'account 已重覆註冊！') }
            else { req.flash('error_messages', 'email 已重覆註冊！') }
            res.redirect('/signup')
          } else {
            req.flash('success_messages', '註冊成功!')
            return User.create({
              account,
              name,
              email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => { res.redirect('/signin') })
          }
        })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  // like tweet
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweetId
    })
      .then(like => {
        return Tweet.findOne({where: {id: like.TweetId}}).then(tweet => {
          return tweet.increment('likeCounts')
        }).then(tweet => {
          return res.redirect('back')
        })
      })
  },
  // unlike tweet
  removeLike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId
      }
    })
      .then(like => {
        return Tweet.findOne({ where: { id: req.params.tweetId } })
        .then(tweet => {
          return tweet.decrement('likeCounts')
        }).then(tweet => {
            return res.redirect('back')
          })
        })
  },
  // following
  addFollowing: (req, res) => {
    // 目前的登入者不行追蹤自己
    console.log('********')
    console.log('req.params.followingId:', req.params.followingId)
    console.log('********')
    console.log('req.user.id:', req.user.id)
    console.log('********')
    const myId = Number(req.params.followingId)
    if (helpers.getUser(req).id === myId) {
      req.flash('error_messages', '幹嘛? 不要給我追蹤自己喔')
      return res.redirect('back')
    }
    return Followship.create({
      // 目前登入的使用者id
      followerId: helpers.getUser(req).id,
      // 我要追蹤的使用者id
      followingId: req.params.followingId
    })
      .then(followship => {
        return res.redirect('back')
      })
  },
  // removeFollowing
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    })
      .then(followship => {
        followship.destroy()
          .then(followship => {
            return res.redirect('back')
          })
      })
  },

  getUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.userId)) {
      return res.json({ status: 'error', message: '' })
    }
    return User.findByPk(req.params.userId)
      .then(user => {
        return res.json(user.toJSON())
      })
  },
  postUser: async (req, res) => {
    const { name, introduction } = req.body
    const { files } = req
    let coverLink
    let avatarLink

    if (files) {
      if (files.cover) {
        coverLink = await getLink(files.cover[0].path)
      }
      if (files.avatar) {
        avatarLink = await getLink(files.avatar[0].path)
      }
      return User.findByPk(req.params.userId)
        .then((user) => {
          return user.update({
            name,
            introduction,
            cover: files.cover ? coverLink : user.cover,
            avatar: files.avatar ? avatarLink : user.avatar
          })
        })
        .then((user) => {
          req.flash('success_messages', '更新個人資料頁成功！')
          return res.redirect(`/users/${req.params.userId}/tweets`)
        })
    } else {
      return User.findByPk(req.params.userId)
        .then((user) => {
          return user.update({
            name,
            introduction,
          })
        })
        .then((user) => {
          req.flash('success_messages', '更新個人資料頁成功！')
          return res.end()
        })
    }
  },
  //使用者個人資料頁面
  getUserTweets: (req, res) => {
    const loginUser = helpers.getUser(req)
    return User.findByPk(req.params.userId, {
      include: Tweet
    })
      .then(user => {
        console.log(user)
        return res.render('userTweets', {
          user: user.toJSON(),
          loginUser
        })
      })
  },
  //設定使用者個人資料頁面推文與回覆頁面
  getUserReplies: (req, res) => {
    const loginUser = helpers.getUser(req)
    return User.findByPk(req.params.userId, {
      include: [Reply, Tweet]
    })
      .then(user => {
        return res.render('userReplies', {
          user: user.toJSON(),
          loginUser
        })
      })
  },
  //使用者喜歡的內容頁面
  getUserLikes: (req, res) => {
    const loginUser = helpers.getUser(req)
    return User.findByPk(req.params.userId, {
      include: [{ model: Tweet, as: 'LikedTweets', include: [User]}]
    }).then(user => {
      const data = user.LikedTweets.map(tweet => ({
        userId: tweet.User.id,
        userAvatar: tweet.User.avatar,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        id: tweet.id,
        createdAt: tweet.createdAt,
        description: tweet.description,
        replyCounts: tweet.replyCounts,
        likeCounts: tweet.likeCounts
      }))
      console.log(data)
      return res.render('userlikes', { loginUser, user, likedTweets: data })
      
    })
      
    // return Like.findAll({
    //   raw: true,
    //   nest: true,
    //   where: {UserId: req.params.userId},
    //   include: [{model: Tweet, include: [User, Reply, Like]}]
    // }).then(likes => {
    //   console.log(likes)
    //   likes.forEach(like => {console.log(like.Tweet.Replies)})
    //   res.render('userlikes', { user,  })
    // })
  },
  // 瀏覽帳號設定頁面
  editSetting: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.userId)) {
      req.flash('error_messages', '你沒有檢視此頁面的權限')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting/edit`)
    }
    return User.findByPk(req.params.userId).then((user) => {
      return res.render('setting', { user: user.toJSON() })
    })
  },

  // 更新帳號設定
  putSetting: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body

    // 檢查使用者是否有編輯權限
    if (helpers.getUser(req).id !== Number(req.params.userId)) {
      req.flash('error_messages', '你沒有檢視此頁面的權限')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting/edit`)
    }

    // 如使用者有輸入密碼或確認密碼，檢查是否一致
    if (password.trim() || passwordCheck.trim()) {
      if (password !== passwordCheck) {
        req.flash('error_messages', '密碼與確認密碼不一致！')
        return res.redirect('back')
      }
    }
    // 檢查是否有其他使用者重複使用表單的帳號或Email
    return User.findOne({
      where: {
        id: { [Op.ne]: helpers.getUser(req).id },
        [Op.or]: [{ account }, { email }]
      }
    }).then((user) => {
      if (user) {　// 如其他使用者存在，區分是重複帳號還是Email
        if (user.account === account) { req.flash('error_messages', 'account 已重覆註冊！') }
        else { req.flash('error_messages', 'email 已重覆註冊！') }
        return res.redirect('back')
      } else {
        return User.findByPk(req.params.userId).then((user) => {
          return user.update({
            account,
            name,
            email,
            password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password
          })
            .then(user => {
              req.flash('success_messages', '帳號資料更新成功!')
              return res.redirect(`/users/${req.params.userId}/setting/edit`)
            })
        })
      }
    })
  }

}

module.exports = userController