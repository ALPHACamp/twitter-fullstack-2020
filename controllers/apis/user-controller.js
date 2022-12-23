const { User } = require('../../models')
const helpers = require('../../_helpers')
const { imgurFileHandler } = require('../../helpers/file-helpers')

const apiController = {
  getUserInfo: async (req, res, next) => {
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
  postUserInfo: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      const { files } = req

      if (!name || name.length > 50) throw new Error('名稱為必填，且限50字內')
      if (introduction?.length > 160) throw new Error('字數限160字以內')

      const user = await User.findByPk(req.params.id)
      const avatar = await imgurFileHandler(files?.avatar && files.avatar[0])
      const cover = await imgurFileHandler(files?.cover && files.cover[0])
      const newUserInfo = await user.update({
        name,
        introduction,
        avatar: avatar || user.avatar,
        cover: cover || user.cover
      })
      const newData = newUserInfo.toJSON()
      delete newData.password
      res.status(200).json({ user: newData })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = apiController
