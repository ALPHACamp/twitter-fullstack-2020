const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../../_helpers')


const userController = {
  getUser: async (req, res) => {
    const userId = req.params.id
    if (Number(userId) !== Number(helpers.getUser(req).id)) {
      req.flash('error_messages', '不能編輯別人的個人資料！')
      return res.status(200).json({ status: 'error' })
    }
    try {
      User.findByPk(userId)
        .then(user => {
          let nameWordCount = ''
          let introWordCount = ''
          if (user.dataValues.introduction) {
            nameWordCount = user.dataValues.name.length
            introWordCount = user.dataValues.introduction.length
          }
          return res.status(200).json({
            name: user.name,
            cover: user.cover,
            avatar: user.avatar,
            introduction: user.introduction,
            nameWordCount: nameWordCount,
            introWordCount: introWordCount,
          })
        })
    } catch (err) {
      req.flash('error_messages', '獲取使用者失敗！')
      res.status(302)
      return res.redirect('back')
    }
  },

  putUserEdit: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', "you can't enter other's profile!")
      return res.redirect('back')
    }

    const { files } = req
    const fileCountsArr = Object.keys(files)
    const fileCounts = fileCountsArr.length

    const getUploadLink = (link) => {
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
        editedUploadLink(tempLink, image)
      } else if (files.cover) {
        tempLink.push(files.cover[0].path)
        image = 'cover'
        editedUploadLink(tempLink, image)
      } else {
        tempLink.push(files.avatar[0].path, files.cover[0].path)
        image = 'both'
        editedUploadLink(tempLink, image)
      }

      async function editedUploadLink(tempLink, image) {

        try {
          const uploadImgs = await Promise.all(tempLink.map(async (link) => {
            const result = await getUploadLink(link)
            return result
          }))

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

          User.findByPk(req.params.id)
            .then(user => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                avatar,
                cover
              }).then(user => {
                req.flash('success_messages', 'profile was successfully to update')
                return res.render('selfTweets', user)
              })
            })

        } catch (err) {
          req.flash('error_messages', '更新失敗！')
          res.status(302)
          return res.redirect('back')
        }
      }
    } else {
      User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            cover: user.cover,
            avatar: user.avatar
          }).then(user => {
            req.flash('success_messages', 'profile was successfully to update')
            return res.render('selfTweets', user)
          })
        })
    }
  }
}

module.exports = userController