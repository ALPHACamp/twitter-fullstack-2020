const { User } = require('../models')
const helpers = require('../_helpers')
const apiServices = require('../service/api-services')

const apiController = {
  getUser: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
      if (userId !== queryUserId) return res.status(200).json({ status: 'error', message: '您無權限編輯使用者 !' })

      const queryUser = await User.findByPk(queryUserId, { raw: true })
      if (!queryUser) return res.status(500).json({ status: 'error', message: '使用者不存在 !' })
      delete queryUser.password

      // return res.status(200).json({ status: 'success', user: queryUser })
      return res.status(200).json(queryUser) // 爲了符合 test 檔案
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id) // from axios
      const { name, introduction, acCover } = req.body // from axios
      const cover = req.files?.cover
      const avatar = req.files?.avatar
      if (userId !== queryUserId) return res.status(200).json({ status: 'error', message: '您無權限編輯使用者 !' })

      const [queryUser, coverFilePath, avatarFilePath] = await Promise.all([User.findByPk(queryUserId), cover ? helpers.imgurFileHandler(cover[0]) : null, avatar ? helpers.imgurFileHandler(avatar[0]) : null])
      if (!queryUser) return res.status(500).json({ status: 'error', message: '使用者不存在 !' })

      const updatedQueryUser = await queryUser.update({ name, introduction, cover: coverFilePath || acCover || queryUser.cover, avatar: avatarFilePath || queryUser.avatar })

      const user = updatedQueryUser.toJSON()
      delete user.password
      req.flash('success_messages', '成功編輯個人資料')
      return res.status(200).json({ status: 'success', user })
    } catch (err) {
      next(err)
    }
  },
  topFollowed: (req, res, next) => {
    apiServices.topFollow(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = apiController
