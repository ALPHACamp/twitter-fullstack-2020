const bcrypt = require('bcryptjs')

const { User, Tweet, Reply, Followship, Like } = require('../models')
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
    User.findByPk(req.user.id, {
      include: [
        Tweet,
        { model: Tweet, include: [Reply] },
      ]
    })
      .then((users) => {

        res.render('userprofile', {
          users: users.toJSON()
        })
      })

  },
  getOtherprofile: (req, res) => {
    User.findByPk(req.params.id,
      {
        include: [
          Tweet,
          { model: Tweet, include: [Reply] },
        ]
      })
      .then((users) => {

        res.render('otherprofile', {
          users: users.toJSON()
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
  addLike: (req, res) => {
    return Like.create({ UserId: req.user.id, TweetId: req.params.TweetId })
      .then(() => {
        return Tweet.findByPk(req.params.TweetId)
          .then((tweet) => {
            return tweet.increment('likes')
          })
      })
      .then(() => res.redirect('back'))
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: { UserId: req.user.id, TweetId: req.params.TweetId }
    })
      .then((like) => {
        like.destroy()
          .then(() => {
            return Tweet.findByPk(req.params.TweetId)
              .then((tweet) => {
                res.redirect('back')
                return Promise.all(tweet.decrement('likes'))
              })
          })
      })
  }
}

module.exports = userController
