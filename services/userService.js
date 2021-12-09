const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const userService = {
  getTopUser: (req, res, cb) => {
    User.findAll({ include: [{ model: User, as: 'Followers' }], where: { role: 'user' } }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(item => item.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.followerCount - a.followerCount)
      cb(users)
    })
  },
  putProfileEdit: async (req, res, callback) => {
    try {
      const { userId } = req.params
      
      if (Number(userId) !== helpers.getUser(req).id) {
        return res.redirect('back')
      }
      const { name, introduction } = req.body
      const { files } = req
      let cover = ''
      let avatar = ''
      if (files) {
        cover = files.cover
        avatar = files.avatar
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
             callback({ status: 'success', message: 'successfully updated!' })
            res.redirect('back')
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
           callback({ status: 'success', message: 'successfully updated!' })
           res.redirect('back')
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
          callback({ status: 'success', message: 'successfully updated!' })
          res.redirect('back')
        })
      } else { 
        const user = await User.findByPk(userId)
        await user.update({
          cover: user.cover,
          avatar: user.avatar,
          name: name,
          introduction: introduction ? introduction : ''
        })
        callback({ status: 'success', message: 'successfully updated!' })
        res.redirect('back')
      }
    } catch (err) {
       console.log(err)
    }
  }
}

module.exports = userService