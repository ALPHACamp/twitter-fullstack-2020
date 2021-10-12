const db = require('../models')
const Op = db.Sequelize.Op
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const Followship = db.Followship
const sequelize = db.sequelize
const helpers = require('../_helpers')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs')

const usersController = {
  getUser: async (req, res) => {
    const requestId = Number(req.params.id)
    try {
      const userTweets = await User.findOne({
        where: { id: requestId },
        include: [
          { model: Tweet, as: 'userTweets', 
            include: [
              { model: Like, as: 'likes', attributes: ['UserId'] },
              { model: Reply, as: 'replies', attributes: ['UserId'] }
            ],
            order: [['createdAt', 'DESC']]
          },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] }
        ]
      })

      let userData = JSON.stringify(userTweets)
      userData = JSON.parse(userData)
      return res.render('userPage', { layout: 'main', userData, to: 'userInfo', render: 'userInfo' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUserTweets: async (req, res) => {
    const UserId = helpers.checkId(req, helpers.getUser(req).id)
    // 取出user所有推文
    try {
      const userTweets = await User.findOne({
        where: { id: UserId },
        include: [
          {
            model: Tweet, as: 'userTweets',
            include: [
              { model: Like, as: 'likes', attributes: ['UserId'] },
              { model: Reply, as: 'replies', attributes: ['UserId'] }
            ],
            order: [['createdAt', 'DESC']]
          },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] }
        ]
      })
      let userData = JSON.stringify(userTweets)
      userData = JSON.parse(userData)
      return res.render('userPage', { layout: 'main', userData, to: 'userInfo', render: 'userTweets' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUserReplies: async (req, res) => {
    const UserId = helpers.checkId(req, helpers.getUser(req).id)
    try {
      const userReplies = await User.findOne({
        where: { id: UserId },
        include: [
          { model: Tweet, as: 'UserRepliedTweet', include: [
            { model: User, as: 'user', attributes: ['id', 'avatar', 'name', 'account'] },
            { model: Like, as: 'likes', attributes: ['UserId'] },
            { model: Reply, as: 'replies', attributes: ['UserId'] }
          ],
          order: [['createdAt', 'DESC']]
          },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] }
        ]
      })
      let userData = JSON.stringify(userReplies)
      userData = JSON.parse(userData)
      return res.render('userPage', { layout: 'main', userData, to: 'userReplies', render: 'userReplies' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUserLikes: async (req, res) => {
    const UserId = helpers.checkId(req, helpers.getUser(req).id)
    try {
      // 取出user like的推文 並且包括推文作者
      const likedTweets = await User.findOne({
        where: { id: UserId },
        include: [
          {
            model: Tweet, as: 'UserLikedTweet',
            include: [
              { model: User, as: 'user', attributes: ['id', 'avatar', 'name', 'account'] },
              { model: Like, as: 'likes', attributes: ['UserId'] },
              { model: Reply, as: 'replies', attributes: ['UserId'] }
            ],
            order: [['createdAt', 'DESC']]
          },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] }
        ]
      })
      let userData = JSON.stringify(likedTweets)
      userData = JSON.parse(userData)
      return res.render('userPage', { layout: 'main', userData, to: 'userLikes', render: 'userLikes' })
    }
    catch (error) {
      console.log(error)
    }
  },

  editUserData: (req, res) => {
    const userId = helpers.getUser(req).id
    const updateData = req.body
    const files = req.files

    if (updateData.password) {
      const password = updateData.password
      const salt = bcrypt.genSalt(10)
      updateData.password = bcrypt.hash(password, salt)
    }

    if (files && Object.keys(files).length) {
      if (files.cover) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(files['cover'][0].path, (err, img) => {
          User.update(
            { ...updateData, cover: img.data.link },
            { where: { id: { [Op.eq]: userId } } }
          )
        })
      }
      if (files.avatar) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(files['avatar'][0].path, (err, img) => {
          User.update(
            { ...updateData, avatar: img.data.link },
            { where: { id: { [Op.eq]: userId } } }
          )
        })
      }
      res.redirect('back')
    } else if (updateData.name) {
      User.update(
        updateData,
        { where: { id: { [Op.eq]: userId } } }
      )
      res.redirect('back')
    } else {
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  }
}

module.exports = usersController