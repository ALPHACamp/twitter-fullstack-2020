const db = require('../../models')
const { User } = db
const helpers = require('../../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let userController = {
  getUser: async (req, res) => {
    const userId = req.params.id
    const id = helpers.getUser(req).id
    if (Number(userId) !== Number(id)) {
      req.flash('error_messages', '只能更改自己的profile')
      return res.status(200).json({ status: 'error' })
    }
    try {
      const user = await User.findByPk(id, {
        attributes: ['cover', 'avatar', 'name', 'introduction']
      })

      const { cover, avatar, name, introduction } = user

      return res.status(200).json({ cover, avatar, name, introduction })
    } catch (err) {
      req.flash('error_messages', '獲取使用者失敗！')
      res.status(302)
      return res.redirect('back')
    }
  },

  putUser: async (req, res) => {
    const { id } = req.params
    if (helpers.getUser(req).id !== Number(id)) {
      req.flash('error_messages', "you can't enter other's profile!")
      return res.redirect('back')
    }

    const { files } = req
    const { name, introduction } = req.body
    const fileCountsArr = files ? Object.keys(files) : false
    const fileCounts = fileCountsArr.length

    const getImgLink = (link) => {
      return new Promise((resolve, reject) => {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(link, (err, img) => {
          return resolve(img.data.link)
        })
      })
    }

    if (fileCounts > 0) {
      const tempLink = []
      let image = ''
      if (files.avatar) {
        tempLink.push(files.avatar[0].path)
        image = 'avatar'
        putImgLink(tempLink, image)
      } else if (files.cover) {
        tempLink.push(files.cover[0].path)
        image = 'cover'
        putImgLink(tempLink, image)
      } else {
        tempLink.push(files.avatar[0].path, files.cover[0].path)
        image = 'both'
        putImgLink(tempLink, image)
      }

      async function putImgLink(tempLink, image) {
        try {
          const uploadImgs = await Promise.all(
            tempLink.map(async (link) => {
              const result = await getImgLink(link)
              return result
            })
          )

          let avatar
          let cover

          if (image === 'both') {
            avatar = uploadImgs[0]
            cover = uploadImgs[1]
          } else if (image === 'avatar') {
            avatar = uploadImgs[0]
          } else if (image === 'cover') {
            cover = uploadImgs[0]
          }

          User.findByPk(id).then((user) => {
            user
              .update({
                name,
                introduction,
                avatar,
                cover
              })
              .then(() => {
                req.flash(
                  'success_messages',
                  'profile was successfully to update'
                )
                return res.redirect(200, `/users/${id}/tweets`)
              })
          })
        } catch (err) {
          req.flash('error_messages', '更新失敗！')
          res.status(302)
          return res.redirect('back')
        }
      }
    } else {
      User.findByPk(id).then((user) => {
        user
          .update({
            name,
            introduction,
            cover: user.cover,
            avatar: user.avatar
          })
          .then((user) => {
            req.flash('success_messages', 'profile was successfully to update')
            return res.redirect(200, `/users/${id}/tweets`)
          })
      })
    }
  }
}

module.exports = userController
