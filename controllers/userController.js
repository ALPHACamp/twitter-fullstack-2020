const { sequelize } = require('../models')

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const helper = require('../_helpers')
const moment = require('moment')
const axios = require('axios')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

// -----------------------------------------------------------------------------------

module.exports = {
  getFollowings: (req, res) => {
    const currentUser = helper.getUser(req)
    return Promise.all([
      User.findOne({
        where: { id: req.params.id },
        include: [{
          model: User,
          as: 'Followings',
          through: {
            attributes: ['createdAt']
          }
        }]
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      })
    ]).then(([user, users]) => {
      const followings = user.dataValues.Followings.map(f => ({
        ...f.dataValues,
        introduction: f.introduction ? f.introduction.substring(0, 150) : '',
        isFollowed: currentUser.Followings.map(v => v.id).includes(f.id),
        timestamp: moment(f.Followship.dataValues.createdAt).format('X')
      }))
      followings.sort((a, b) => b.timestamp - a.timestamp)

      users = JSON.parse(JSON.stringify(users))
      users.sort((a, b) => b.Followers.length - a.Followers.length)
      users.slice(0, 10)
      users = users.map(user => ({
        ...user,
        isFollowed: user.Followers.map(d => d.id).includes(currentUser.id)
      }))
      users = users.filter(user => user.id !== currentUser.id)
      sidebarFollowings = users

      res.render('followings', {
        user: user.toJSON(),
        currentUser,
        followings,
        sidebarFollowings
      })
    })
  },

  getFollowers: (req, res) => {
    const currentUser = helper.getUser(req)
    return Promise.all([
      User.findOne({
        where: { id: req.params.id },
        include: [{
          model: User,
          as: 'Followers',
          through: {
            attributes: ['createdAt']
          }
        }]
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      })
    ]).then(([user, users]) => {
      const followers = user.dataValues.Followers.map(f => ({
        ...f.dataValues,
        introduction: f.introduction ? f.introduction.substring(0, 150) : '',
        isFollowed: currentUser.Followings.map(v => v.id).includes(f.id),
        timestamp: moment(f.Followship.dataValues.createdAt).format('X')
      }))
      followers.sort((a, b) => b.timestamp - a.timestamp)

      users = JSON.parse(JSON.stringify(users))
      users.sort((a, b) => b.Followers.length - a.Followers.length)
      users.slice(0, 10)
      users = users.map(user => ({
        ...user,
        isFollowed: user.Followers.map(d => d.id).includes(currentUser.id)
      }))
      users = users.filter(user => user.id !== currentUser.id)
      sidebarFollowings = users

      res.render('followers', {
        user: user.toJSON(),
        currentUser,
        followers,
        sidebarFollowings
      })
    })
  },

  getUser: (req, res) => {
    const currentUser = helper.getUser(req)
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Tweet.findAll({
        // raw: true,
        // nest: true,
        where: { UserId: req.params.id },
        include: [User, Reply, { model: Like, include: [User] }],
        order: [['createdAt', 'DESC']],
      }),
      User.findAll({
        // raw: true,
        // nest: true,
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      }),
      Like.findAll({
        where: { UserId: req.params.id },
        include: [User, { model: Tweet, include: [User, Reply, Like] }],
      }),
      Reply.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet, include: [User] }]
      })
    ]).then(([user, tweets, followings, likedTweets, replies]) => {

      followings = JSON.parse(JSON.stringify(followings))
      followings.sort((a, b) => b.Followers.length - a.Followers.length)
      followings.slice(0, 10)
      followings = followings.map(user => ({
        ...user,
        isFollowed: user.Followers.map(d => d.id).includes(currentUser.id)
      }))
      followings = followings.filter(user => user.id !== currentUser.id)
      sidebarFollowings = followings
      // console.log(req.query.page)

      // switch for pages, including '', reply, like
      let data = null
      req.query.page = req.query.page ? req.query.page : ''
      if (req.query.page === '') {
        data = tweets.map(tweet => ({
          ...tweet.dataValues,
          countLikes: tweet.Likes.length,
          countReplies: tweet.Replies.length,
          User: tweet.User.dataValues,
          isLike: tweet.Likes.map(d => d.UserId).includes(Number(req.params.id)),
        }))
      }

      if (req.query.page === 'like') {
        data = likedTweets.map(like => ({
          ...like.dataValues,
          id: like.Tweet.dataValues.id,
          User: like.Tweet.dataValues.User.dataValues,
          countLikes: like.Tweet.dataValues.Likes.length,
          countReplies: like.Tweet.dataValues.Replies.length,
          description: like.Tweet.dataValues.description,
          isLike: true,
        }))
      }

      currentUser.isFollowed = currentUser.Followings.map(d => d.id).includes(Number(req.params.id))

      if (req.query.page === 'reply') {
        data = replies.map(reply => ({
          ...reply.dataValues,
          ...reply.Tweet.dataValues,
          User: reply.Tweet.dataValues.User.dataValues,
        }))
      }
      console.log(currentUser)
      return res.render('profile', {
        user: user.toJSON(),
        FollowersLength: user.dataValues.Followers.length,
        FollowingsLength: user.dataValues.Followings.length,
        tweetsLength: tweets.length,
        data: data,
        sidebarFollowings,
        page: req.query.page,
        currentUser,
        navPage: 'profile'
      })
    })
  },

  putUser: (req, res) => {
    const nextURL = `/users/${req.params.id}/tweets`

    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect(nextURL)
    }

    if (!req.body.introduction) {
      req.flash('error_messages', 'introduction didn\'t exist')
      return res.redirect(nextURL)
    }

    // ---------------------------------------------------------------------------------------

    const tempFileAddr = __dirname + '\\..\\icon\\temp.png'
    const avatarPath = req.files.avatar ? req.files.avatar[0].path : tempFileAddr
    const coverPath = req.files.cover ? req.files.cover[0].path : tempFileAddr

    // console.log('--------------------------------------------------------------------------')
    // console.log('avatarPath ' + avatarPath)
    // console.log('coverPath ' + coverPath)

    imgur.setClientId(process.env.IMGUR_CLIENT_ID);

    return Promise.all([
      imgur.uploadFile(avatarPath).then((img) => {
        return User.findByPk(req.params.id).then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: req.files.avatar ? img.data.link : user.avatar,
            cover: user.cover
          })
        })
      }),
      imgur.uploadFile(coverPath).then((img) => {
        return User.findByPk(req.params.id).then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            cover: req.files.cover ? img.data.link : user.cover
          })
        })
      })
    ])
      .then(() => {
        return User.findByPk(req.params.id).then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            cover: user.cover
          }).then(() => {
            return res.redirect('back')
          })
        })
      })
  },

  getEdit: (req, res) => {
    const id = req.params.id
    const userId = helper.getUser(req).id
    const currentUser = helper.getUser(req)
    const data = currentUser
    res.render('edit', { data, currentUser, navPage: 'setting' })
  },

  putUserInfo: (req, res) => {
    const currentUser = helper.getUser(req)
    const { account, name, email, password, confirmPassword } = req.body
    const data = {
      id: req.params.id,
      account: account,
      name: name,
      email: email,
    }
    if (password) {
      data.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }
    const errors = []

    if (password !== confirmPassword) {
      errors.push({ message: "Password doesn't match the confirm password." })
    }
    if (errors.length) {
      return res.render('edit', { data, errors, currentUser })
    }
    User.findByPk(data.id).then(user => {
      user.update(data)
      res.redirect(`/users/${data.id}/tweets`)
    })
  }

}
