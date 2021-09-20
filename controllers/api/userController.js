const imgur = require('imgur-node-api')
const db = require('../../models')
const User = db.User

const helpers = require('../../_helpers')

const fs = require('fs')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  getUser: async (req, res) => {
    const userId = req.params.userId
    const id = helpers.getUser(req).id
    if (Number(userId) !== Number(id)) {
      req.flash('error_messages', '只能更改自己的profile')
      res.redirect('back')
    }
    try {
      const user = await User.findByPk(id, {
        attributes: ['cover', 'avatar', 'name', 'introduction']
      })

      res.json({ user })
    } catch (err) {
      console.log(err)
    }
  },
  editUser: async (req, res) => {
    const userId = req.params.userId
    const id = helpers.getUser(req).id
    const { files } = req
    const userUpload = {}
    userUpload.name = req.body.userName
    userUpload.intro = req.body.userIntro

    const uploadImgur = path => {
      return new Promise((resolve, reject) => {
        imgur.upload(path, (err, img) => {
          if (err) {
            return reject(err)
          }
          resolve(img)
        })
      })
    }

    if (Number(userId) !== Number(id)) {
      req.flash('error_messages', '只能更改自己的profile')
      res.redirect('/tweets')
    }
    try {
      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        for (const file in files) {
          userUpload[file] = await uploadImgur(files[file][0].path)
        }
      }

      const user = await User.findByPk(id)
      user.update({
        name: userUpload.name,
        introduction: userUpload.intro,
        cover: userUpload.cover ? userUpload.cover.data.link : user.cover,
        avatar: userUpload.avatar ? userUpload.avatar.data.link : user.avatar
      })

      return res.redirect(`/users/${id}/tweets`)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = userController
