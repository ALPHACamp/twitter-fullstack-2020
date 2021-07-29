const bcrypt = require('bcryptjs')
const { replaceSetter } = require('sinon')
const { User, Like } = require('../models')
const userService = require('../services/userService')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

const userController = {
  signUpPage: async (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      const userAccount = await User.findOne({ where: { account: req.body.account } })
      if (userAccount) {
        req.flash('error_messages', '帳號已被註冊！')
        return res.redirect('/signup')
      }
      const userEmail = await User.findOne({ where: { email: req.body.email } })
      if (userEmail) {
        req.flash('error_messages', '信箱已被註冊！')
        return res.redirect('/signup')
      }
      await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      }).then(user => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
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

  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  userPage: (req, res) => {
    userService.getUserTweets(req, res, (data) => {
      return res.render('users', data)
    })
  },

  userPageReplies: (req, res) => {
    userService.getUserReplies(req, res, (data) => {
      return res.render('users-replies', data)
    })
  },

  userPageLikes: (req, res) => {
    userService.getUserLikes(req, res, (data) => {
      return res.render('users-liked', data)
    })
  },

  userFollowersPage: (req, res) => {
    userService.getUserFollowers(req, res, (data) => {
      return res.render('users-followers', data)
    })
  },

  userFollowingsPage: (req, res) => {
    userService.getUserFollowings(req, res, (data) => {
      return res.render('users-followings', data)
    })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweetId
    })
      .then((like) => {
        return res.redirect('back')
      })
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId,
      }
    })
      .then((like) => {
        like.destroy()
          .then((tweet) => {
            return res.redirect('back')
          })
      })
  },

  getUserSetting: async (req, res) => {
    const isMySelf = helpers.getUser(req).id.toString() === req.params.id.toString()
    if (!isMySelf) {
      req.flash('error_messages', 'you can only edit your own profile!')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
    }
    const user = await User.findByPk(req.params.id)
    return res.render('userSetting', {
      user: user.toJSON(),
      Appear: { navbar: true }
    })
  },

  putUserSetting: async (req, res) => {
    const { error_messages, userSetting } = res.locals
    if (error_messages.length) {
      return res.render('userSetting', {
        user: userSetting,
        Appear: { navbar: true }
      })
    }
    let user = await User.findByPk(req.params.id)
    await user.update({
      ...userSetting,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    })
    return res.redirect('/tweets')
  },

  getFollowing: async (req, res) => {
    if (req.body.id === helpers.getUser(req).id.toString()) {
      return res.redirect(200, '不要玩網站')
    }
    userService.getFollowing(req, res, () => res.redirect('back'))
  },

  deleteFollowing: async (req, res) => {
    userService.deleteFollowing(req, res, () => res.redirect('back'))
  },

  // chat 測試區開始
  chatAll: async (req, res) => {
    const isMySelf = req.user.id.toString() === req.params.id.toString()
    if (!isMySelf) {
      req.flash('error_messages', 'you can only edit your own profile!')
      return res.redirect(`/users/${req.user.id}/chatAll`)
    }
    const user = await User.findByPk(req.params.id)
    return res.render('chatAll', {
      user: user.toJSON(),
      Appear: { navbar: true }
    })
  },

  allChatPrivate: async (req, res) => {
    const privateUsers = await User.findAll({
      raw: true,
      where: {
        [Op.and]: [
          { id: { [Op.ne]: req.user.id } },
          { role: { [Op.is]: null } }
        ]
      }
    })
    return res.render('chatPrivate', {
      privateUsers,
      Appear: { navbar: true }
    })
  },

  singleChatPrivate: async (req, res) => {
    const user = await User.findByPk(req.user.id)
    const receiver = await User.findByPk(req.params.receiverId)
    const privateUsers = await User.findAll({
      raw: true,
      where: {
        [Op.and]: [
          { id: { [Op.ne]: req.user.id } },
          { role: { [Op.is]: null } }
        ]
      }
    })
    return res.render('chatPrivate', {
      privateUsers,
      user: user.toJSON(),
      receiver: receiver.toJSON(),
      Appear: { navbar: true }
    })
  }
}


module.exports = userController
