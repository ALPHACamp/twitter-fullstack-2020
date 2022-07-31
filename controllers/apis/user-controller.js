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

        const { id, name, introduction, banner, avatar } = user
        res.status(200).json({ id, name, introduction, banner, avatar })
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => {
    const UserId = req.params.userId
    const { name, introduction } = req.body
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
          banner: bannerFilePath || user.banner,
          avatar: avatarFilePath || user.avatar
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(200, `/users/${user.id}/tweets`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
