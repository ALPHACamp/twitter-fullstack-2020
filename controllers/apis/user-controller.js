const { User } = require('../../models')

const { getUser } = require('../../_helpers')
const { isAdmin } = require('../../helpers/user-helpers')

const userController = {
  getUser: (req, res, next) => {
    const UserId = req.params.userId

    if (Number(UserId) !== getUser(req).id) throw new Error('不可編輯其他人資料')

    return User.findByPk(UserId, { raw: true, nest: true })
      .then(user => {
        if (!user || isAdmin(user)) throw new Error('使用者不存在')
        res.status(200).json({ user })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
