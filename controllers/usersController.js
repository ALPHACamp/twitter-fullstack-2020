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
      const tweet = await Tweet.findAll({
        raw: true,
        nest: true,
        plain: false,
        where: { UserId: { [Op.eq]: requestId } },
        attributes: ['id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM `likes` WHERE likes.TweetId = Tweet.id)'), 'likesNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `replies` WHERE replies.TweetId = Tweet.id)'), 'repliesNum'],
          [sequelize.literal(`(SELECT UserId FROM ${`replies`} WHERE replies.TweetId = Tweet.id AND replies.UserId = ${requestId} limit 1)`), 'reply'],
          [sequelize.literal(`(SELECT UserId FROM ${`likes`} WHERE likes.TweetId = Tweet.id AND likes.UserId = ${requestId} limit 1)`), 'like']
        ],
        order: [['createdAt', 'DESC']]
      })
      const user = {
        id: helpers.getUser(req).id,
        name: helpers.getUser(req).name,
        account: helpers.getUser(req).account,
        avatar: helpers.getUser(req).avatar,
        introduction: helpers.getUser(req).introduction,
        createdAt: helpers.getUser(req).createdAt
      }
      const userInfo = await User.findOne({
        raw: true,
        nest: true,
        where: { id: { [Op.eq]: requestId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover', 'introduction',
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followerNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum'],
          [sequelize.literal(`(SELECT id FROM ${`followships`} WHERE followships.followingId = ${requestId} AND followships.followerId = ${user.id} limit 1)`), 'isFollowing']
        ]
      })
      return res.render('userPage', { layout: 'main', userInfo, tweet, user, to: 'userInfo', render: 'userInfo' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUserTweets: async (req, res) => {
    const requestId = helpers.checkId(req, helpers.getUser(req).id)
    // 取出user所有推文
    try {
      const tweet = await Tweet.findAll({
        raw: true,
        nest: true,
        plain: false,
        where: { UserId: { [Op.eq]: requestId } },
        attributes: ['id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM `likes` WHERE likes.TweetId = Tweet.id)'), 'likesNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `replies` WHERE replies.TweetId = Tweet.id)'), 'repliesNum'],
          [sequelize.literal(`(SELECT UserId FROM ${`replies`} WHERE replies.TweetId = Tweet.id AND replies.UserId = ${requestId} limit 1)`), 'reply'],
          [sequelize.literal(`(SELECT UserId FROM ${`likes`} WHERE likes.TweetId = Tweet.id AND likes.UserId = ${requestId} limit 1)`), 'like']
        ],
        order: [['createdAt', 'DESC']]
      })
      
      const user = {
        id: helpers.getUser(req).id,
        name: helpers.getUser(req).name,
        account: helpers.getUser(req).account,
        avatar: helpers.getUser(req).avatar,
        introduction: helpers.getUser(req).introduction,
        createdAt: helpers.getUser(req).createdAt
      }

      const userInfo = await User.findOne({
        raw: true,
        nest: true,
        where: { id: { [Op.eq]: requestId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover', 'introduction',
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followerNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum'],
          [sequelize.literal(`(SELECT id FROM ${`followships`} WHERE followships.followingId = ${requestId} AND followships.followerId = ${user.id} limit 1)`), 'isFollowing']
        ]
      })
      
      return res.render('userPage', { layout: 'main', userInfo, tweet, user, to: 'userInfo', render: 'userTweets' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUserReplies: async (req, res) => {
    const requestId = helpers.checkId(req, helpers.getUser(req).id)
    try {
      const userReplies = await Reply.findAll({
        raw: true,
        nest: true, 
        plain: false,
        where: { UserId: { [Op.eq]: requestId } },
        attributes: ['comment', 'createdAt'],
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Tweet, as: 'tweet', include: [
            {model: User, as: 'user', attributes: ['account']}
          ]  }
        ],
        order: [['createdAt', 'DESC']]
      })

      const user = {
        id: helpers.getUser(req).id,
        name: helpers.getUser(req).name,
        account: helpers.getUser(req).account,
        avatar: helpers.getUser(req).avatar,
        introduction: helpers.getUser(req).introduction,
        createdAt: helpers.getUser(req).createdAt
      }

      const userInfo = await User.findOne({
        raw: true,
        nest: true,
        where: { id: { [Op.eq]: requestId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover', 'introduction',
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followerNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum'],
          [sequelize.literal(`(SELECT id FROM ${`followships`} WHERE followships.followingId = ${requestId} AND followships.followerId = ${user.id} limit 1)`), 'isFollowing']
        ]
      })
      
      return res.render('userPage', { layout: 'main', userReplies, userInfo, user, to: 'userReplies', render: 'userReplies' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUserLikes: async (req, res) => {
    const requestId = helpers.checkId(req, helpers.getUser(req).id)
    try {
      const likedTweets = await Like.findAll({
        raw: true,
        nest: true,
        plain: false,
        where: { UserId: { [Op.eq]: requestId } },
        attributes: ['createdAt'],
        include: [
          {
            model: Tweet, as: 'tweet',
            attributes: ['id', 'description', 'createdAt',
              [sequelize.literal('(SELECT COUNT(*) FROM `likes` WHERE likes.TweetId = Tweet.id)'), 'likesNum'],
              [sequelize.literal('(SELECT COUNT(*) FROM `replies` WHERE replies.TweetId = Tweet.id)'), 'repliesNum'],
              [sequelize.literal(`(SELECT UserId FROM ${`replies`} WHERE replies.TweetId = Tweet.id AND replies.UserId = ${requestId} limit 1)`), 'reply'],
              [sequelize.literal(`(SELECT UserId FROM ${`likes`} WHERE likes.TweetId = Tweet.id AND likes.UserId = ${requestId} limit 1)`), 'like']
            ], 
            include: [
              { model: User, as: 'user', attributes: ['id', 'name', 'account', 'avatar'] }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      const user = {
        id: helpers.getUser(req).id,
        name: helpers.getUser(req).name,
        account: helpers.getUser(req).account,
        avatar: helpers.getUser(req).avatar,
        introduction: helpers.getUser(req).introduction,
        createdAt: helpers.getUser(req).createdAt
      }

      const userInfo = await User.findOne({
        raw: true,
        nest: true,
        where: { id: { [Op.eq]: requestId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover', 'introduction',
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followerNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum'],
          [sequelize.literal(`(SELECT id FROM ${`followships`} WHERE followships.followingId = ${requestId} AND followships.followerId = ${user.id} limit 1)`), 'isFollowing']
        ]
      })
      return res.render('userPage', { layout: 'main', likedTweets, userInfo, user, to: 'userLikes', render: 'userLikes' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  editUserData: async (req, res) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('error_messages', '不可修改他人資料')
      return res.redirect('back')
    }
    const userId = helpers.getUser(req).id
    const updateData = req.body
    const files = req.files

    if (updateData.password) {
      const password = updateData.password
      const salt = bcrypt.genSalt(10)
      updateData.password = bcrypt.hash(password, salt)
    }
    try {
      if (files && Object.keys(files).length) {
        if (files.cover) {
          imgur.setClientID(IMGUR_CLIENT_ID);
          imgur.upload(files['cover'][0].path, async (err, img) => {
            await User.update(
              { ...updateData, cover: img.data.link },
              { where: { id: { [Op.eq]: userId } } }
            )
          })
        }
        if (files.avatar) {
          imgur.setClientID(IMGUR_CLIENT_ID);
          imgur.upload(files['avatar'][0].path, async (err, img) => {
            await User.update(
              { ...updateData, avatar: img.data.link },
              { where: { id: { [Op.eq]: userId } } }
            )
          })
        }
        return res.redirect(`/users/${userId}`)
      } else if (updateData.account || updateData.introduction) {
        await User.update(
          updateData,
          { where: { id: { [Op.eq]: userId } } }
        )
        res.redirect(`/users/${userId}`)
      } else {
        req.flash('error_messages', '操作失敗')
        return res.redirect('back')
      }
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUserFollowings: async (req, res) => {
    const requestId = helpers.checkId(req, helpers.getUser(req).id)
    try {
      const user = {
        id: helpers.getUser(req).id,
        name: helpers.getUser(req).name,
        account: helpers.getUser(req).account,
        avatar: helpers.getUser(req).avatar,
        description: helpers.getUser(req).description,
        createdAt: helpers.getUser(req).createdAt
      }
      // 取得當前user及其跟隨對象資料
      const userFollowings = await User.findAll({
        raw: true,
        nest: true,
        plain: false,
        where: { id: { [Op.eq]: requestId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover', 'introduction',
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum']
        ],
        include: [
          { model: User, as: 'Followings', attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'role'] } }
        ]
      })
      if (userFollowings.length) {
        userInfo = userFollowings[0]
      }
      return res.render('userFollow', { layout: 'main', user, userInfo, userFollowings, to: 'userInfo', render: 'userFollowings', btn: 'followings' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUserFollowers: async (req, res) => {
    const requestId = helpers.checkId(req, helpers.getUser(req).id)
    try {
      const user = {
        id: helpers.getUser(req).id,
        name: helpers.getUser(req).name,
        account: helpers.getUser(req).account,
        avatar: helpers.getUser(req).avatar,
        description: helpers.getUser(req).description,
        createdAt: helpers.getUser(req).createdAt
      }
  
      const userFollowers = await User.findAll({
        raw: true,
        nest: true,
        plain: false,
        where: { id: { [Op.eq]: requestId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover', 'introduction',
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum']
        ],
        include: [
          { model: User, as: 'Followers', attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'role'] } }
        ]
      })
      if (userFollowers.length) {
        userInfo = userFollowers[0]
      }

      return res.render('userFollow', { layout: 'main', user, userInfo, userFollowers, to: 'userInfo', render: 'userFollowers', btn: 'followers' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getUserInfoEdit: async (req, res) => {
    const requestId = Number(req.params.id)
    try {
      const userInfo = await User.findByPk(requestId, { raw: true })
      if (Object.keys(userInfo).length) {
        return res.render('editForm', { layout: 'main', userInfo, to: 'edit' })
      }
      req.flash('error_messages', '查無相關資料')
      return res.redirect('back')
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  }
}

module.exports = usersController