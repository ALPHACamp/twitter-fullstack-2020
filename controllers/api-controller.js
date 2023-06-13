const { User } = require('../models')
const helpers = require('../_helpers')

const apiController = {
  getUser: (req, res, next) => { // 取得帳戶設定頁面
    const id = req.params.id
    if (+id !== +helpers.getUser(req).id) {
      return res.json({ status: 'error' })
    }
    return User.findByPk(id, { raw: true, nest: true })
      .then(user => {
        if (!user) throw new Error('沒有此使用者')
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => { // 編輯帳戶設定
    const { name } = req.body
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('沒有此使用者')
        return user.update({ name })
      })
      .then(user => res.json({ status: 'success', user }))
      .catch(err => next(err))
  }
}

module.exports = apiController
