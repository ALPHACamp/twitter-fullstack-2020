const helpers = require('../_helpers')
const {
  // localFileHandler
  imgurFileHandler
} = require('../helpers/file-helpers')

const { User } = require('../models')

const apiController = {
  getUserInfo: async (req, res, next) => {
    try {
      const currentUserId = Number(helpers.getUser(req).id)
      const userId = Number(req.params.id)
      if (currentUserId !== userId) {
        return res.status(200).json({
          status: 'error',
          message: "Can not edit other user's account!"
        })
      }
      const existUser = await User.findByPk(userId, { raw: true })
      if (!existUser) throw new Error("Account didn't exist!")
      const name = existUser.name
      return res.json({ status: 'success', name, existUser })
    } catch (err) {
      next(err)
    }
  },
  postUserInfo: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      if (currentUser.id !== Number(req.params.id)) {
        return res
          .status(200)
          .json({ status: 'error', message: '你只能編輯你自己的檔案' })
      }
      const editUser = await User.findByPk(Number(req.params.id))
      const { name, introduction } = req.body
      if (!name) {
        return res
          .status(200)
          .json({ status: 'error', message: '名稱不能為空白' })
      }
      let avatar
      let coverPhoto
      if (process.env.NODE_ENV !== 'test') {
        req.files.avatar
          ? (avatar = await imgurFileHandler(req.files.avatar[0]))
          : (avatar = currentUser.avatar)
        req.files.coverPhoto
          ? (coverPhoto = await imgurFileHandler(req.files.coverPhoto[0]))
          : (coverPhoto = currentUser.coverPhoto)
      }
      const patchedUser = await editUser.update({
        name,
        introduction,
        avatar,
        coverPhoto
      })
      res.json({ status: 200, data: patchedUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = apiController
