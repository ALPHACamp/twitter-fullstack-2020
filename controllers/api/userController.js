const db = require('../../models')
const { User, Tweet, Reply, Like } = db
const helpers = require('..//../_helpers')

const fs = require('fs')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  //////////////
  //Profile
  //////////////

  userProfile: (req, res) => {
    const id = req.params.id
    User.findByPk(id)
      .then(user => res.json(user))
      .catch(err => console.log(err))
  },

  updateProfile: (req, res) => {
    const { name, introduction } = req.body
    const id = helpers.getUser(req).id
    const { files } = req

    if (files) {
      const fieldName = Object.keys(files)[0];
      let file = ""
      if (fieldName === 'avatar') {      //判斷檔案是avatar或cover
        file = files.avatar[0]
      } else {
        file = files.cover[0]
      }
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        console.log(img)
        return User.findByPk(id)
          .then((user) => {
            user.update({
              cover: file.fieldname === "cover" ? img.data.link : user.cover,
              avatar: file.fieldname === "avatar" ? img.data.link : user.avatar,
              name: user.name,
              introduction: user.introduction
            })
              .then((user) => {
                return res.json(user)
              }).catch(err => console.log(err))
          })
      })
    }
    else {
      return User.findByPk(id)
        .then(user => {
          user.update({
            cover: user.cover,
            avatar: user.avatar,
            name: name ? name : user.name,
            introduction: introduction ? introduction : user.introduction
          }).then((user) => {
            return res.json(user)
          }).catch(err => console.log(err))
        })
    }
  }
}

module.exports = userController