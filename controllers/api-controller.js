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
        if (currentUser.id !== user.id) throw new Error('無法觀看編輯其他使用者資料！')

        res.json(user.toJSON())
      } catch (err) {
        req.flash('error_messages', err.message)
        res.json({ status: 'error', message: err.message });
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
        if (!name) throw new Error('name不可空白')
        if (name?.length > 50) throw new Error('name字數超出上限')
        if (introduction?.length > 160) throw new Error('introduction字數超出上限')
        if (user.id !== logInUserId) throw new Error('無法編輯別人的頁面')

        const data = await user.update({
          name,
          introduction,
          avatar: uploadAvatar || user.avatar,
          background: uploadBackground || user.background
        })
        res.json({ status: 'success', message: '已成功更新!', data })
      } catch (err) {
        req.flash('error_messages', err.message)
        res.json({ status: 'error', message: err.message });
        next(err)
      }
    },
    uploadImage: async (req, res) => {
      const { files } = req
      const uploadBackground = await imgurFileHandler(files?.background?.[0])
      const uploadAvatar = await imgurFileHandler(files?.avatar?.[0])
      res.json({ uploadBackground, uploadAvatar })
    },
    deleteImage: async (req, res) => {
      const uploadBackground = helpers.getUser(req).background || 'https://i.imgur.com/ndXEE6d.jpg'
      res.json({ uploadBackground })
    }
}

module.exports = apiController