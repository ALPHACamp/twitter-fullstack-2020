const bcrypt = require('bcryptjs')

const { User } = require('../models')
const { Tweet } = require('../models')
const { Reply } = require('../models')
const { Followship } = require('../models')

const { Op } = require('sequelize')

// const imgur = require('imgur-node-api')
// const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return (res.redirect('/signup'))
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password,
              bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
    const { name, account, email, password, passwordConfirm } = req.body
    const errors = []
    if (!name || !account || !email || !password || !passwordConfirm) {
      errors.push({ msg: '所有欄位都是必填。' })
    }
    if (password !== passwordConfirm) {
      errors.push({ msg: '密碼及確認密碼不一致！' })
    }
    if (errors.length) {
      return res.render('signup', {
        errors, name, account, email, password, passwordConfirm
      })
    }
    User.findOne({
      where: {
        [Op.or]: [{ account }, { email }]
      }
    }).then(user => {
      if (user) {
        errors.push({ msg: '帳號或Email已註冊！' })
        return res.render('signup', {
          errors, name, account, email, password, passwordConfirm
        })
      }
      return User.create({
        name, account, email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      }).then(() => {
        req.flash('success_messages', '註冊成功！')
        return res.redirect('/signin')
      })
    })
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getTweets: (req, res) => {
    return res.render('tweets')
  },
  addFollowing: (req, res) => {

    if (req.user.id === req.params.id) {
      return res.redirect("back");
    }
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then(() => res.redirect('back'))
  },
  removeFollowing: (req, res) => {

    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => followship.destroy())
      .then(() => res.redirect('back'))

  },
  getProfile: (req, res) => {
    Promise.all([
      User.findByPk(req.user.id, {
        include: [
          Tweet,
          { model: Tweet, include: [Reply] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
        order: ['created']
      }),
      User.findAll({
        where: { is_admin: false },
        include: [{ model: User, as: 'Followers' }]
      })
    ]).then(([users, followship]) => {
      //超過千位，加逗點
      const thousandComma = function (num) {
        let result = '', counter = 0
        num = (num || 0).toString()
        for (let i = num.length - 1; i >= 0; i--) {
          counter++
          result = num.charAt(i) + result
          if (!(counter % 3) && i !== 0) { result = ',' + result }
        }
        return result
      }
      console.log(users)
      const followerscount = users.Followers.length
      const followingscount = users.Followings.length

      followship = followship.map(followships => ({
        ...followships.dataValues,
        FollowerCount: followships.Followers.length,
        isFollowed: req.user.Followings.some(d => d.id === followships.id)
      }))
      followship = followship.sort((a, b) => b.FollowerCount - a.FollowerCount)


      res.render('userprofile', {
        users: users.toJSON(),
        followerscount: thousandComma(followerscount),     //幾個跟隨我
        followingscount: thousandComma(followingscount),   //我跟隨幾個
        followship: followship
      })
    })

  },
  getOtherprofile: (req, res) => {
    Promise.all([
      User.findByPk(req.params.id, {
        include: [
          Tweet,
          { model: Tweet, as: 'LikedTweet' },
          { model: Tweet, include: [Reply] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ]
      }),
      User.findAll({
        where: { is_admin: false },
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ]).then(([users, followship]) => {

      //超過千位，加逗點
      const thousandComma = function (num) {
        let result = '', counter = 0
        num = (num || 0).toString()
        for (let i = num.length - 1; i >= 0; i--) {
          counter++
          result = num.charAt(i) + result
          if (!(counter % 3) && i !== 0) { result = ',' + result }
        }
        return result
      }
      const userId = req.user.id
      const likeTweets = users.LikedTweet
      const followerscount = users.Followers.length
      const followingscount = users.Followings.length

      // 計算追蹤者人數
      followship = followship.map(followships => ({
        ...followships.dataValues,
        FollowerCount: followships.Followers.length,
        isFollowed: req.user.Followings.some(d => d.id === followships.id)
      }))
      followship = followship.sort((a, b) => b.FollowerCount - a.FollowerCount)

      res.render('otherprofile', {
        userId: userId,
        users: users.toJSON(),
        followerscount: thousandComma(followerscount),     //幾個跟隨我
        followingscount: thousandComma(followingscount),   //我跟隨幾個
        likeTweets: likeTweets,
        followship: followship
      })
    })
  },
  toggleNotice: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (req.user.id === req.params.id) {
          res.redirect('back')
        }

        const isNoticed = !user.isNoticed
        user.update({ isNoticed })
      })
      .then((user) => {
        req.flash('success_messages', '已開啟訂閱！')
        res.redirect('back')
      })
  },
}

module.exports = userController



