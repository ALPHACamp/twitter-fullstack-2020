const { User } = require('../models')
const bcrypt = require('bcryptjs')
const userController = {
  getEditPage: (req, res, next) => {
    return User.findByPk(req.params.userId)
      .then(user => res.render('users/edit', {
        userId: req.params.userId,
        account: user.account,
        name: user.name,
        email: user.email
      })
      )
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼不相符!')
    if (name.length > 50) throw new Error('暱稱長度不可超過50個字!')
    if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) throw new Error('所有欄位皆要填寫!')

    return Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      .then(([sameEmailUser, sameAccountUser]) => {
        if (sameEmailUser && sameEmailUser.id !== req.user.id) throw new Error('該Email已被使用!')
        if (sameAccountUser && sameAccountUser.id !== req.user.id) throw new Error('該帳號名稱已被使用!')
        return Promise.all([User.findByPk(req.params.userId), bcrypt.hash(req.body.password, 10)])
      })
      .then(([user, hash]) => {
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          name,
          account,
          email,
          password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/api/users/${req.params.userId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
