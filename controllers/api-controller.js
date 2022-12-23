const db = require('../models')
const User = db.User
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../file_helpers')

const apiController = {
  editUser: (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const userId = Number(req.params.id)

    if (currentUserId !== userId) res.json({ status: 'error' })

    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在！')
        delete user.password
        res.json(user)
      })
      .catch(err => next(err))
  },
  putUser: async (req, res, next) => {
    const userId = req.params.id
    const { files } = req
    const { name, introduction } = req.body

    const user = await User.findByPk(userId)
    let avatarFilePath = user.dataValues.avatar
    let coverFilePath = user.dataValues.background
    console.log(files, name, introduction)
    if (files?.image) {
      avatarFilePath = await imgurFileHandler(...files.image)
    }

    if (files?.coverImage) {
      coverFilePath = await imgurFileHandler(...files.coverImage)
    }

    if (!user) throw new Error('使用者不存在！')
    await user.update({
      name,
      introduction,
      avatar: avatarFilePath,
      background: coverFilePath
    })
    req.flash('success_messages', '個人資料儲存成功 !')
    return res.json({ status: 'success', ...user.toJSON() })
  }

}

module.exports = apiController
