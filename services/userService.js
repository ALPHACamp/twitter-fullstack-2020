const helpers = require('../_helpers')
// const bcrypt = require('bcryptjs')
// const { Op } = require("sequelize")
// const sequelize = require('sequelize')

const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = {
  renderUserEdit: (req, res, callback) => {
    const currentUser = helpers.getUser(req)
    return User.findOne({
      where: { id: req.params.id },
      include: [
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then((user) => {
        if (currentUser.id !== user.id) {
          return callback({ status: 'error', message: "無法編輯其他使用者資料！" })
        }
        callback({
          id: user.id,
          name: user.name,
          introduction: user.introduction,
          cover: user.cover,
          avatar: user.avatar,
        })
      })
      .catch(err => console.log(err))
  },

  putUserEdit: async (req, res, callback) => {
    const { name, introduction } = req.body
    if (!name) {
      return callback({ status: 'error', message: "請輸入名稱！" })
    } else if (name.length > 50) {
      return callback({ status: 'error', message: "名稱長度不能超過 50 字！" })
    }
    const files = Object.assign({}, req.files)
    const isCoverDelete = req.body.isDelete
    const user = await User.findByPk(req.params.id)

    imgur.setClientID(IMGUR_CLIENT_ID)
    if (files.avatar && files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        imgur.upload(files.cover[0].path, async (err, covImg) => {
          await user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: avaImg.data.link,
            cover: isCoverDelete ? '' : covImg.data.link
          })
          return callback({ status: 'success', message: 'user profile was successfully updated!' })
        })
      }
      )
    } else if (files.avatar && !files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        await user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          avatar: avaImg.data.link,
          cover: isCoverDelete ? '' : user.cover
        })
        return callback({ status: 'success', message: 'user profile was successfully updated!' })
      })
    } else if (!files.avatar && files.cover) {
      imgur.upload(files.cover[0].path, async (err, covImg) => {
        await user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          cover: isCoverDelete ? '' : covImg.data.link,
        })
        return callback({ status: 'success', message: 'user profile was successfully updated!' })
      })
    } else {
      await user.update({
        name: req.body.name,
        introduction: req.body.introduction,
        cover: isCoverDelete ? '' : user.cover
      })
      callback({ status: 'success', message: 'user profile was successfully updated!' })
    }
  }
}

module.exports = userService