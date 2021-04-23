const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Followship, Tweet, Reply, Like } = db
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signInPage: (_req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role !== 'admin') {
      req.flash('success_messages', '登入成功！')
      res.redirect('/tweets')
    } else {
      req.flash('error_messages', '管理者請從後台登入！')
      res.redirect('/signin')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Sign out successfully！')
    req.logout()
    res.redirect('/signin')
  },
  signUpPage: (_req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
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
              }).then(_user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
            }
          })
        }
      })
    }
  },
  follow: (req, res) => {
    const followTargetId = req.body.id
    const currentUserId = helpers.getUser(req).id
    if (Number(followTargetId) === currentUserId) {
      req.flash('error_messages', '不能追蹤自己喔！')
      return res.render('error')
    } else {
      return Followship.create({
        followerId: currentUserId,
        followingId: followTargetId
      })
        .then(() => {
          return res.redirect('back')
        })
    }
  },
  unfollow: (req, res) => {
    const followTargetId = req.params.id
    const currentUserId = helpers.getUser(req).id
    return Followship.findOne({
      where: {
        followerId: currentUserId,
        followingId: followTargetId
      }
    })
      .then(favorite => {
        favorite.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  getSetting: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', '無法修改其他使用者資訊')
      res.redirect('/tweets')
    } else {
      return res.render('setting')
    }
  },
  putSetting: async (req, res) => {
    const id = req.params.id
    const { email: currentEmail, account: currentAccount } = helpers.getUser(req)
    const { account, name, email, password, checkPassword } = req.body

    const error = []
    let newEmail = ''
    let newAccount = ''

    if (currentEmail === email) { newEmail = currentEmail }
    if (currentAccount === account) { newAccount = currentAccount }
    if (password !== checkPassword) {
      error.push({ message: '兩次密碼輸入不同！' })
    }

    if (currentEmail !== email) {
      await User.findOne({ where: { email } })
        .then(user => {
          if (user) { error.push({ message: '信箱已經被註冊' }) } else { newEmail = email }
        })
    }

    if (currentAccount !== account) {
      await User.findOne({ where: { account } })
        .then(user => {
          if (user) { error.push({ message: '帳號已存在' }) } else { newAccount = account }
        })
    }

    if (error.length !== 0) {
      return res.render('setting', { error })
    }

    if (!password) {
      return User.findByPk(id)
        .then(user => user.update({ name, email: newEmail, account: newAccount }))
        .then(() => {
          const success = []
          success.push({ message: '成功更新帳號資訊!' })
          return res.render('setting', { success })
        })
    } else {
      return User.findByPk(id)
        .then(user => user.update({ name, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), email: newEmail, account: newAccount }))
        .then(() => {
          req.flash('success_messages', '成功更新帳號資訊!')
          res.redirect('/tweets')
        })
    }
  },
  editUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.json({ status: 'error' })
    } else {
      User.findByPk(req.params.id).then(user => {
        return res.json({ name: user.name })
      })
    }
  },
  putUserInfo: async (req, res) => {
    const { files } = req
    const { name, introduction } = req.body
    const { cover, avatar } = req.files
    if (!name) {
      req.flash('error_messages', '請輸入想更換的名稱')
      return res.redirect('back')
    }
    if (name.length > 50) {
      req.flash('error_messages', '名稱不可超過 50 字')
      return res.redirect('back')
    }
    if (introduction.length > 160) {
      req.flash('error_messages', '自我介紹不可超過 160 字')
      return res.redirect('back')
    }
    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      if (cover) {
        imgur.upload(cover[0].path, (_err, img) => {
          return User.findByPk(req.params.id)
            .then((user) => {
              user.update({
                name: name,
                introduction: introduction,
                cover: files ? img.data.link : user.cover
              })
            })
        })
      } if (avatar) {
        imgur.upload(avatar[0].path, (_err, img) => {
          return User.findByPk(req.params.id)
            .then((user) => {
              user.update({
                name: name,
                introduction: introduction,
                avatar: files ? img.data.link : user.avatar
              })
            })
        })
      } else {
        await User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: name,
              introduction: introduction
            })
          })
      }
      req.flash('success_messages', '個人資料成功更新')
      res.redirect(`/users/${req.params.id}/tweets`)
    }
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
      users = users.filter(user => (user.role === 'user' && user.name !== helpers.getUser(req).name))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 6)
      res.locals.recommendedList = users
      return next()
    })
  },
  getUserFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' }
      ]
    }).then(user => {
      user.update({ followerCount: user.Followers.length })
      const results = user.toJSON()
      results.Followers = user.Followers.map(user => ({
        ...user.dataValues,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      results.tweetCount = user.Tweets.length
      results.Followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return res.render('user/follower', {
        results
      })
    })
  },
  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followings' }
      ]
    }).then(user => {
      user.update({ followingCount: user.Followings.length })
      const results = user.toJSON()
      results.Followings = user.Followings.map(user => ({
        ...user.dataValues,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      results.tweetCount = user.Tweets.length
      results.Followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return res.render('user/following', {
        results
      })
    })
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
      ],
      order: [[Tweet, 'createdAt', 'DESC']]
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
        Tweet,
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
      ],
      order: [[Like, 'createdAt', 'DESC']]
    }).then(user => {
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id

      pageUser.Likes.forEach(tweet => {
        tweet.isLiked = tweet.Tweet.Likes.map(d => d.UserId).includes(currentUserId)
      })
      pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(pageUser.id)

      return res.render('user/like', {
        users: pageUser,
        currentUserId: currentUserId
      })
    })
  },
  getUserReplies: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
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
      ],
      order: [[Reply, 'createdAt', 'DESC']]
    }).then(user => {
      const pageUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id

      pageUser.Replies.forEach(tweet => {
        tweet.isLiked = tweet.Tweet.Likes.map(d => d.UserId).includes(currentUserId)
      })
      pageUser.isFollowed = helpers.getUser(req).Followings.map(item => item.id).includes(pageUser.id)

      return res.render('user/reply', {
        users: pageUser,
        currentUserId: currentUserId
      })
    })
  }
}

module.exports = userController
