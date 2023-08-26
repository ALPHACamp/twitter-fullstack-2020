const db = require('../models')
const { User, Tweet } = db
// const helper = require('../_helpers')

const userController = {
  editUser: (req, res, next) => {
    const settingRoute = true
    // 待測試取到的值是否正確
    // const currentUser = helper.getUser(req).id || null
    User.findByPk(2, { raw: true, nest: true })
      .then(user => res.render('setting', { user, settingRoute }))
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const profileRoute = true
    // 待測試取到的值是否正確
    // const currentUser = helper.getUser(req).id || null
    return Promise.all([
      Tweet.findAll({
        // test for now
        where: { UserId: 2 },
        raw: true,
        nest: true,
        include: User,
        order: [['createdAt', 'DESC']]
      }),
      User.findByPk(2, { raw: true })
    ])
      .then(([tweets, user]) => {
        res.render('profile', { tweets, user, profileRoute })
      })
      .catch(err => next(err))
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
  }

  // signUp: (req, res, next) => {
  //   if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')

  //   Promise.all([
  //     User.findOne({ where: { account: req.body.account } }),
  //     User.findOne({ where: { email: req.body.email } })]
  //   )
  //     .then([account, email] => {
  //       if (user) throw new Error('Email already exists!')
  //       return bcrypt.hash(req.body.password, 10) // 前面加 return
  //     })
  //     .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
  //       name: req.body.name,
  //       email: req.body.email,
  //       password: hash
  //     }))
  //     .then(() => {
  //       req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
  //       res.redirect('/signin')
  //     })
  //     .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  // },
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
