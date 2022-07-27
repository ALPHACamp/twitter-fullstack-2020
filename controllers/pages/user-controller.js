const { User } = require('../../models')

const userConroller = {
  getSignin: (req, res) => {
    res.render('signin')
  },
  postSignin: (req, res) => {
    const ADMIN = 'admin'
    if (req.user.role === ADMIN) {
      req.logout()
      req.flash('error_messages', '帳號不存在')
      return res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入')
    return res.redirect('/tweets')
  },
  getSetting: (req, res, next) => {
    const id = req.user.id

    User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        user = user.toJSON()
        console.log(user)
        res.render('setting', { user })
      })
      .catch(err => next(err))
  }
}

module.exports = userConroller
