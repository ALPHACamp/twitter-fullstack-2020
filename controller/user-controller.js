// const { imgurFileHandler } = require('../helpers/file-helpers')
const { Tweet, User, Like, Reply } = require('../models')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [
          { model: Tweet, include: [Reply] },
          { model: Reply },
          { model: Like },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      if (!user) throw new Error("user didn't exist!")
      console.log(user.toJSON())
      let personal
      // 沒有登入流程，不會走passport就不會拿到req.user
      // 目前回傳給前端的user是上面資料庫從params.id找出來的user
      // 以下為第二種確認登入者id是否=params.id的方法
      // console.log('req.user', req.user)
      // req.user.id.toString() === req.params.id
      //   ? personal = true
      //   : personal = false
      return res.render('user', {
        user: user.toJSON(),
        personal
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
