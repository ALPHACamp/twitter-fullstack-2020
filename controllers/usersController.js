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
      const userInfo = await User.findOne({
        raw: true,
        nest: true,
        where: { id: { [Op.eq]: requestId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followerNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum']
        ]
      })

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
        ]
      })
      return res.render('userPage', { layout: 'main', userInfo, tweet, user: helpers.getUser(req).toJSON(), to: 'userInfo', render: 'userInfo' })
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
      const userInfo = await User.findOne({
        raw: true,
        nest: true,
        where: { id: { [Op.eq]: requestId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followerNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum']
        ]
      })

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
        ]
      })
      // return res.json(tweet)
      return res.render('userPage', { layout: 'main', userInfo, tweet, user: helpers.getUser(req).toJSON(), to: 'userInfo', render: 'userTweets' })
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
        ]
      })

      const userInfo = await User.findOne({
        raw: true,
        nest: true,
        where: { id: { [Op.eq]: requestId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followerNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum']
        ]
      })
      return res.render('userPage', { layout: 'main', userReplies, userInfo, user: helpers.getUser(req).toJSON(), to: 'userReplies', render: 'userReplies' })
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