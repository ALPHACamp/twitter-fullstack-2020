const { User, Tweet } = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const apiController = {
  editUser: (req, res, next) => {
    if (Number(req.params.id) !== Number(helpers.getUser(req).id)) return res.json({ status: 'error', message: '請勿編輯他人資料' })

    return User.findByPk(req.params.id,
      {
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      .then(user => {
        const data = user.toJSON()
        const name = data.name
        res.json({ status: 'success', data, name })
      })
      .catch(err => next(err))
  },
  putUser: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      const cover = req.files ? req.files.cover : ''
      const avatar = req.files ? req.files.avatar : ''
      let coverFilePath = ''
      let avatarFilePath = ''

      if (!name) return res.json({ status: 'error', message: 'User name is required!' })
      if (name.length > 50) return res.json({ status: 'error', message: '名稱字數超出上限！' })

      const user = await User.findByPk(req.params.id)

      if (!user) return res.json({ status: 'error', message: "User didn't exist!" })
      if (user.id !== Number(helpers.getUser(req).id)) return res.json({ status: 'error', message: "Don't revise other user data!" })
      if (cover) {
        coverFilePath = await imgurFileHandler(cover[0])
      }
      if (avatar) {
        avatarFilePath = await imgurFileHandler(avatar[0])
      }

      const upadteUser = await user.update({
        email: user.email,
        password: user.password,
        name,
        avatar: avatarFilePath || user.avatar,
        cover: coverFilePath || user.cover,
        introduction,
        role: user.role,
        account: user.account
      })

      res.json({ status: 'success', upadteUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = apiController
