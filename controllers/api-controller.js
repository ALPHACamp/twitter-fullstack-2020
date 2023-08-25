const { User } = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

  const apiController = {
    getUser: async (req, res, next) => {
      try {
        const currentUser = helpers.getUser(req)
        const UserId = req.params.id
        const user = await User.findOne({
          where: { id: UserId }
        })
        if (currentUser.id !== user.id) {
          return res.json({ status: 'error', messages: '無法編輯其他使用者資料！' })
        }
        res.json(user.toJSON())
      } catch (err) {
        next(err)
      }
    },
    putUser: async (req, res, next) => {
      try {
        const logInUserId = helpers.getUser(req).id
        const UserId = req.params.id
        const { name } = req.body
        const introduction = req.body.introduction || ''
        const avatar = req.files ? req.files.avatar : ''
        const background = req.files ? req.files.background : ''

        let uploadAvatar = ''
        let uploadBackground = ''
        if (avatar) {
          uploadAvatar = await imgurFileHandler(avatar[0])
        }
        if (background) {
          uploadBackground = await imgurFileHandler(background[0])
        }
        const user = await User.findByPk(UserId)

        const data = await user.update({
          name,
          introduction,
          avatar: uploadAvatar || user.avatar,
          background: uploadBackground || user.background
        })
        res.json({ status: 'success', message: '已成功更新!', data })
      } catch (err) {
        next(err)
      }
    },
    uploadImage: async (req, res) => {
      const { files } = req
      const uploadBackground = await imgurFileHandler(files?.background?.[0])
      const uploadAvatar = await imgurFileHandler(files?.avatar?.[0])
      res.json({ uploadBackground, uploadAvatar })
    }
}

module.exports = apiController