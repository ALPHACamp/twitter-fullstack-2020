const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const _helpers = require('../_helpers')
const imgurFileHandler = require('../helpers/file-helper')

const apiController = {
  getUserProfile: async (req, res, next) => {
    try {
      const UserId = Number(req.params.uid)
      const loginUserId = _helpers.getUser(req).id

      if (UserId !== loginUserId) return res.json({
        status: 'error',
        message: '不能瀏覽他人的編輯頁面'
      })

      const user = await User.findByPk(UserId, {
        raw: true,
        attributes: ['id', 'cover', 'avatar', 'name', 'introduction']
      })

      res.json({
        status: 'success',
        ...user
      })

    } catch (err) { next(err) }
  },
  putUserProfile: async (req, res, next) => {
    try {
      const UserId = Number(req.params.uid)
      const loginUserId = _helpers.getUser(req).id
      const { name, introduction, cover, avatar } = req.body

      if (name?.length > 50) throw new Error('name字數不正確')
      if (introduction?.length > 160) throw new Error('introduction字數不正確')
      if (UserId !== loginUserId) throw new Error('無法編輯別人的頁面')

      const user = await User.findByPk(UserId)

      let newUser = await user.update({
        name: name || user.name,
        introduction: introduction || user.introduction,
        cover: cover || user.cover,
        avatar: avatar || user.avatar
      })
      newUser = newUser.toJSON()
      delete newUser.password

      res.json({
        data: newUser
      })
    } catch (err) { next(err) }
  },
  uploadImage: async (req, res) => {
    const { files } = req
    const coverPath = await imgurFileHandler(files?.cover?.[0])
    const avatarPath = await imgurFileHandler(files?.avatar?.[0])
    res.json({ coverPath, avatarPath })
  }
}

module.exports = apiController