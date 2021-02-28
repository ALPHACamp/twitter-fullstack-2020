const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')
const Followship = db.Followship
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const sequelize = require('sequelize')
const imgPromise = require('../_helpers').imgPromise
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const imgur = require('imgur-node-api')
const followship = require('../models/followship')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複')
              return res.redirect('/signup')
            } else
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
          })

        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  addFollowing: async (req, res) => {
    //tweet data
    let tweets = await Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Like, Reply]
    })
    tweets = tweets.map(t => ({
      ...t.dataValues,
      userName: t.User.name,
      userId: t.User.id,
      userAvatar: t.User.avatar,
      userAccount: t.User.account,
      LikedCount: t.Likes.length,
      ReplyCount: t.Replies.length,
      isLiked: helpers.getUser(req).Likes ? helpers.getUser(req).Likes.map(d => d.TweetId).includes(t.id) : false
    }))
    //user data
    let users = await User.findAll({
      limit: 10,
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Followships AS Followship
              WHERE Followship.followingId = User.id
            )`),
            'FollowerCount'
          ]
        ]
      },
      order: [
        [sequelize.literal('FollowerCount'), 'DESC']
      ],
      where: {
        role: 'user'
      },
      include: [
        { model: User, as: 'Followers' } //找出每個User被追蹤的名單(user.Followers)
      ]
    })

    users = users.map(user => ({
      ...user.dataValues,
      isFollowed: helpers.getUser(req).Followings.some(d => d.id === user.id)
    }))

    if (Number(helpers.getUser(req).id) !== Number(req.body.id)) {
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      })
      return res.redirect('back')
    }
    return res.render('tweets', { users, tweets })
  },

  removeFollowing: async (req, res) => {
    const awaitRemove = await Followship.findOne({
      where: { followerId: helpers.getUser(req).id, followingId: req.params.id }
    })
    await awaitRemove.destroy()
    req.flash('success_messages', '成功取消追隨')
    return res.redirect('back')
  },

  getUserPage: async (req, res) => {
    let userView = await User.findByPk(req.params.id, {
      include: [
        { model: Like },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet },
        { model: Reply }
      ]
    })
    userView = userView.toJSON()
    const totalReplies = userView.Replies.length
    const totalLikes = userView.Likes.length
    const totalFollowers = userView.Followers.length
    const totalFollowings = userView.Followings.length

    return res.render('user', { userView, totalReplies, totalLikes, totalFollowers, totalFollowings })
  },

  getUsers: async (req, res) => {
    let users = await User.findAll()
    users = users.map(user => ({
      ...user.dataValues,
      isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
    }))
    return users
  },

  getUserTweetsAndRepliesPage: async (req, res) => {
    //todo
  },
  getUserLikesPage: async (req, res) => {
    let userView = await User.findByPk(req.params.id, {
      include: [
        { model: Like, include: [{ model: Tweet, include: [User] }] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
      ],
      order: [
        [Like, 'createdAt', 'DESC']
      ]
    })
    userView = userView.toJSON()
    userView.tweets = userView.Likes.map(like => {
      return like.Tweet
    })
    const totalFollowers = userView.Followers.length
    const totalFollowings = userView.Followings.length
    return res.render('likes', { userView, totalFollowers, totalFollowings })
  },

  editUserFromEditPage: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    const { files } = req
    let avatarLink, coverLink = ''
    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      async function start() {
        try {
          if (files.avatar) {
            avatarLink = await imgPromise(files.avatar[0])
          }
          if (files.cover) {
            coverLink = await imgPromise(files.cover[0])
          }
          user.update({
            avatar: avatarLink,
            cover: coverLink,
            name: req.body.name,
            introduction: req.body.introduction
          })
        } catch (e) {
          console.log(e)
        }
      }
      await start()
      return res.redirect('back')
    }
    user.update({
      avatar: user.avatar,
      cover: user.cover,
      name: req.body.name,
      introduction: req.body.introduction
    })
    return res.redirect('back')
  },

  getUserFollowingPage: async (req, res) => {
    let user = await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Tweets AS Tweet
              WHERE Tweet.UserId = ${req.params.id}
            )`),
            'TweetsCount'
          ]
        ]
      },
      include: [
        { model: User, as: 'Followings' },
      ]
    })
    user = user.toJSON()
    return res.render('userFollowing', { user })
  },
  getUserFollowerPage: async (req, res) => {
    let user = await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Tweets AS Tweet
              WHERE Tweet.UserId = ${req.params.id}
            )`),
            'TweetsCount'
          ]
        ]
      },
      include: [
        { model: User, as: 'Followers' }
      ]
    })
    user = user.toJSON()
    user.Followers.map(user => {
      user.isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
    })
    return res.render('userFollower', { user })
  }
}

module.exports = userController