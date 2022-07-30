const userServices = require('../services/user-services')
const helpers = require('../_helpers')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const apiController = {
  renderEditPage: (req, res) => {
    userServices.renderEditPage(req, res, (data) => {
      return res.status(200).json(data)
    })
  },
  putEditPage: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const userId = req.params.id
      const { name } = req.body
      const introduction = req.body.introduction || ''
      const avatar = req.files ? req.files.avatar : ''
      const cover = req.files ? req.files.cover : ''

      let uploadAvatar = ''
      let uploadCover = ''
      if (avatar) {
        uploadAvatar = await imgurFileHandler(avatar[0])
      }
      if (cover) {
        uploadCover = await imgurFileHandler(cover[0])
      }
      const user = await User.findByPk(userId)

      if (user.id !== Number(currentUserId)) return res.json({ status: 'error', message: '不可編輯其他使用者資料！' })
      if (!name) return res.json({ status: 'error', message: '名字不可空白！' })
      if (name.length > 50) return res.json({ status: 'error', message: '字數超出上限！' })
      if (introduction.length > 160) return res.json({ status: 'error', message: '字數超出上限！' })

      console.log('req.body', req.body)
      console.log('avatar', avatar)
      console.log('uploadAvatar', uploadAvatar)




      const data = await user.update({
        name,
        introduction,
        avatar: uploadAvatar || user.avatar,
        cover: uploadCover || user.cover
      })
      res.json({ status: 'success', message: '已成功更新!', data })

    } catch (err) {
      next(err)
    }
  }
}



module.exports = apiController


