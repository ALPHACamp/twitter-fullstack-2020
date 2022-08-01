const { User } = require('../../models')

const helpers = require('../../_helpers')
const { isAdmin } = require('../../helpers/user-helpers')
const { imgurFileHelper } = require('../../helpers/file-helpers')

const userController = {
  getUser: (req, res, next) => {
    const UserId = req.params.userId

    if (Number(UserId) !== helpers.getUser(req).id) throw new Error('不可編輯其他人資料')

    return User.findByPk(UserId, { raw: true, nest: true })
      .then(user => {
        if (!user || isAdmin(user)) throw new Error('使用者不存在')

        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => {
    const UserId = req.params.userId
    const { name, introduction, removeChecked } = req.body
    const banner = req.files?.banner || []
    const avatar = req.files?.avatar || []

    if (Number(UserId) !== helpers.getUser(req).id) throw new Error('不可編輯其他人資料')
    if (name.length > 50 || introduction?.length > 160) throw new Error('字數超出上限！')

    return Promise.all([
      User.findByPk(UserId),
      imgurFileHelper(...banner),
      imgurFileHelper(...avatar)
    ])
      .then(([user, bannerFilePath, avatarFilePath]) => {
        if (!user) throw new Error('使用者不存在')

        return user.update({
          name,
          introduction,
          banner: bannerFilePath || (removeChecked ? '' : user.banner), // 若有上傳檔案，使用新banner，若無，先確認使用者是否點選移除
          avatar: avatarFilePath || user.avatar
        })
      })
      .then(user => {
        res.status(200).json({ user })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
