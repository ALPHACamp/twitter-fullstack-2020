const { User } = require('../models')
const bcrypt = require('bcryptjs')
const userController = {
  getEditPage: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => res.render('users/edit', {
        id: req.params.id,
        account: user.account,
        name: user.name,
        email: user.email
      }))
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼不相符!')
    if (name.length > 50) throw new Error('暱稱長度不可超過50個字!')

    return Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      .then(([sameEmailUser, sameAccountUser]) => {
        if (sameEmailUser && sameEmailUser.id !== req.user.id) throw new Error('該Email已被使用!')
        if (sameAccountUser && sameAccountUser.id !== req.user.id) throw new Error('該帳號名稱已被使用!')
        return User.findByPk(req.params.id)
      })
      .then(user => {
        let hash = null
        if (password) {
          hash = bcrypt.hash(password, 10)
        }
        return [user, hash]
      })
      .then(([user, hash]) => {
        if (!user) throw new Error('使用者不存在!')
        const updateInfo = {}
        if (password) updateInfo.password = hash
        if (account) updateInfo.account = account
        if (name) updateInfo.name = name
        if (email) updateInfo.email = email
        return user.update(updateInfo)
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/api/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
