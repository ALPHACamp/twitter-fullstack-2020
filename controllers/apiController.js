const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

const apiController = {
  getUser: async (req, res) => {
    try {
      const { userId } = req.params
      if (Number(userId) === helpers.getUser(req).id) {
        const user = await User.findByPk(userId, { attributes: ['id', 'cover', 'avatar', 'name', 'introduction'] })
        return res.json(user.toJSON())
      } else {
        return res.json({ status: 'error' })
      }
    } catch (err) {
      return res.json({ status: 'error', message: err })
    }
  },

  postUser: async (req, res, callback) => {
    try {
      const { userId } = req.params
      
      if (Number(userId) !== helpers.getUser(req).id) {
        return callback({ status: 'error', message: 'invalid user' })
      }
      const { name, introduction } = req.body
      const { files } = req
      let cover = ''
      let avatar = ''
      if (files) {
        cover = files.cover
        avatar = files.avatar
      }
      
      if (!name) {
        return callback({ status: 'error', message: 'empty value' })
      }
     
      if (name.length > 50) {
        return callback({ status: 'error', message: 'larger length' })
      }
     
      if (introduction) {
        if (introduction.length > 140) {
          return callback({ status: 'error', message: 'larger length' })
        }
      }
      
      if (cover && avatar) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(cover[0].path, (err, imgCover) => {
          if (avatar) {
            imgur.upload(avatar[0].path, async (err, imgAvr) => {
              const user = await User.findByPk(userId)
              await user.update({
                cover: cover[0] ? imgCover.data.link : user.cover,
                avatar: avatar[0] ? imgAvr.data.link : user.avatar,
                name: name,
                introduction: introduction ? introduction : ''
              })
              return callback({ status: 'success' })
            })
          }
        })
      } else if (cover) { 
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(cover[0].path, async (err, imgCover) => {
          const user = await User.findByPk(userId)
          await user.update({
            cover: cover[0] ? imgCover.data.link : user.cover,
            avatar: user.avatar,
            name: name,
            introduction: introduction ? introduction : ''
          })
          return callback({ status: 'success' })
        })
      } else if (avatar) { 
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(avatar[0].path, async (err, imgAvr) => {
          const user = await User.findByPk(userId)
          await user.update({
            cover: user.cover,
            avatar: avatar[0] ? imgAvr.data.link : user.avatar,
            name: name,
            introduction: introduction ? introduction : ''
          })
          return callback({ status: 'success' })
        })
      } else { 
        const user = await User.findByPk(userId)
        await user.update({
          cover: user.cover,
          avatar: user.avatar,
          name: name,
          introduction: introduction ? introduction : ''
        })
        return callback({ status: 'success' })
      }
    } catch (err) {
      return callback({ status: 'error', message: err })
    }
  }
}

module.exports = apiController