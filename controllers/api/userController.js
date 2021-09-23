const db = require('../../models')
const { User, Tweet, Reply, Like } = db
const helpers = require('../../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let userController = {
  getUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.json({ status: 'error' })
    } else {
      User.findByPk(req.params.id).then((user) => {
        return res.json({ name: user.name })
      })
    }
  },

  putUser: async (req, res) => {
    const { files } = req
    const { name, introduction } = req.body
    const { cover, avatar } = req.files
    if (!name) {
      req.flash('error_messages', '請輸入想更換的名稱')
      return res.redirect('back')
    }
    if (name.length > 50) {
      req.flash('error_messages', '名稱不可超過 50 字')
      return res.redirect('back')
    }
    if (introduction.length > 160) {
      req.flash('error_messages', '自我介紹不可超過 160 字')
      return res.redirect('back')
    }
    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      if (cover) {
        imgur.upload(cover[0].path, (_err, img) => {
          return User.findByPk(req.params.id).then((user) => {
            user.update({
              name: name,
              introduction: introduction,
              cover: files ? img.data.link : user.cover
            })
          })
        })
      }
      if (avatar) {
        imgur.upload(avatar[0].path, (_err, img) => {
          return User.findByPk(req.params.id).then((user) => {
            user.update({
              name: name,
              introduction: introduction,
              avatar: files ? img.data.link : user.avatar
            })
          })
        })
      } else {
        await User.findByPk(req.params.id).then((user) => {
          user.update({
            name: name,
            introduction: introduction
          })
        })
      }
      req.flash('success_messages', '個人資料成功更新')
      res.redirect(`/users/${req.params.id}/tweets`)
    }
  }
}

module.exports = userController
