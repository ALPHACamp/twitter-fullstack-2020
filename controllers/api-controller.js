const helpers = require('../_helpers')
const {
  localFileHandler,
  imgurFileHandler
} = require('../helpers/file-helpers')
const fileHelper =
  process.env.NODE_ENV === 'production' ? imgurFileHandler : localFileHandler

const { User, Followship } = require('../models')

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
          ? (avatar = await fileHelper(req.files.avatar[0]))
          : (avatar = currentUser.avatar)
        req.files.coverPhoto
          ? (coverPhoto = await fileHelper(req.files.coverPhoto[0]))
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
  },
  putFollow: async (req, res, next) => {
    try {
      const UserId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)
      if (UserId === followingId) {
        console.log('hey')
        return res.status(200).json({
          status: 'error',
          message: "You can't follow yourself"
        })
      }

      const user = await User.findByPk(followingId)
      if (!user) throw new Error("User didn't exist")
      if (user.role === 'admin') {
        return res.status(200).json({
          status: 'error',
          message: "You can't follow admin"
        })
      }

      const isFollowed = await Followship.findOne({
        where: { followerId: UserId, followingId }
      })

      if (isFollowed) {
        await isFollowed.destroy()
        return res.redirect('back')
      }

      await Followship.create({
        followerId: UserId,
        followingId
      })
      return res.redirect('/')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = apiController
