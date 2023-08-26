const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')

const userController = {
  editUser: (req, res, next) => {
    res.render('setting')
  },
  getUserTweets: (req, res, next) => {
    res.render('profile')
  },
  signInPage: (req, res, next) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    if (req.user.role === 'admin') {
      req.flash('error_messages', '帳號不存在！')
      res.redirect('/signin')
    } else {
      req.flash('success_messages', '您已成功登入！')
      res.redirect('/tweets')
    }
  },
  signUpPage: (req, res, next) => {
    res.render('signup')
  },
  logOut: (req, res, next) => {
    req.flash('success_messages', '您已成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (account.length > 50) throw new Error('字數超出上限！')
    if (name.length > 50) throw new Error('字數超出上限！')
    if (password !== checkPassword) throw new Error('密碼輸入不一致！')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })]
    )
      .then(([userAccount, userEmail]) => {
        if (userAccount) throw new Error('account 已重複註冊！')
        if (userEmail) throw new Error('email 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '恭喜註冊成功！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  }
  // addFollowing: (req, res, next) => {
  //   const { userId } = req.params
  //   Promise.all([
  //     User.findByPk(userId),
  //     Followship.findOne({
  //       where: {
  //         followerId: req.user.id,
  //         followingId: userId
  //       }
  //     })
  //   ])
  //     .then(([user, followship]) => {
  //       if (user.toJSON().id === req.user.id) throw new Error("Can't follow yourself")
  //       if (!user) throw new Error("User didn't exist!")
  //       if (followship) throw new Error('Your are already following this user!')
  //       return Followship.create({
  //         followerId: req.user.id,
  //         followingId: userId
  //       })
  //     })
  //     .then(() => res.redirect('back'))
  //     .catch(err => next(err))
  // },
  // deleteFollowing: (req, res, next) => {
  //   Followship.findOne({
  //     where: {
  //       followerId: req.user.id,
  //       followingId: req.params.userId
  //     }
  //   })
  //     .then(followship => {
  //       if (!followship) throw new Error("You haven't followed this user!")
  //       return followship.destroy()
  //     })
  //     .then(() => res.redirect('back'))
  //     .catch(err => next(err))
  // }
}

module.exports = userController
