const { sequelize } = require('../models')

const imgur = require('imgur-node-api')
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
    User.findOne({
      where: { id: req.params.id },
      include: [{
        model: User,
        as: 'Followings',
        through: {
          attributes: ['createdAt']
        }
      }]
    })
      .then(user => {
        const currentUser = helper.getUser(req)
        const followings = user.dataValues.Followings.map(f => ({
          ...f.dataValues,
          introduction: f.introduction.substring(0, 150),
          isFollowed: currentUser.Followings.map(v => v.id).includes(f.id),
          timestamp: moment(f.Followship.dataValues.createdAt).format('X')
        }))

        followings.sort((a, b) => b.timestamp - a.timestamp)

        res.render('followings', {
          user: user.toJSON(),
          currentUser,
          followings
        })
      })
  },

  getFollowers: (req, res) => {
    User.findOne({
      where: { id: req.params.id },
      include: [{
        model: User,
        as: 'Followers',
        through: {
          attributes: ['createdAt']
        }
      }]
    })
      .then(user => {
        const currentUser = helper.getUser(req)
        const followers = user.dataValues.Followers.map(f => ({
          ...f.dataValues,
          introduction: f.introduction.substring(0, 150),
          isFollowed: currentUser.Followings.map(v => v.id).includes(f.id),
          timestamp: moment(f.Followship.dataValues.createdAt).format('X')
        }))

        followers.sort((a, b) => b.timestamp - a.timestamp)

        res.render('followers', {
          user: user.toJSON(),
          currentUser,
          followers
        })
      })
  },

  getUser: (req, res) => {
    const selfUser = helper.getUser(req)
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
        include: [{ model: User, as: 'Followers' }]
      }),
      Like.findAll({
        where: { UserId: req.params.id },
        include: [User, { model: Tweet, include: [User, Reply, Like] }],
      })
    ]).then(([user, tweets, followings, likedTweets]) => {

      followings = followings.map(user => ({
        ...user.dataValues,
        isFollowed: user.Followers.map(d => d.id).includes(Number(req.params.id))
      }))
      followings = followings.filter(user => user.role !== "admin")
      followings = followings.filter(user => user.id !== Number(req.params.id))
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
      } else if (req.query.page === 'like') {
        data = likedTweets.map(like => ({
          ...like.dataValues,
          User: like.Tweet.dataValues.User.dataValues,
          countLikes: like.Tweet.dataValues.Likes.length,
          countReplies: like.Tweet.dataValues.Replies.length,
          description: like.Tweet.dataValues.description,
          isLike: true,
        }))
      }

      return res.render('profile', {
        user: user.toJSON(),
        FollowersLength: user.dataValues.Followers.length,
        FollowingsLength: user.dataValues.Followings.length,
        tweetsLength: tweets.length,
        data: data,
        followings: followings,
        page: req.query.page,
        selfUser
      })
    })
  },

  putUser: async (req, res) => {
    const nextURL = `/users/${req.params.id}`

    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect(nextURL)
    }

    if (!req.body.introduction) {
      req.flash('error_messages', 'introduction didn\'t exist')
      return res.redirect(nextURL)
    }

    const user = await User.findByPk(req.params.id)
    const avatarFile = req.files.avatar
    const coverFile = req.files.cover

    imgur.setClientID(process.env.IMGUR_CLIENT_ID);
    console.log(process.env.IMGUR_CLIENT_ID)

    if (coverFile) {
      imgur.upload(coverFile[0].path, (err, img) => {
        return user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          cover: coverFile ? img.data.link : user.cover,
          avatar: user.avatar,
        })
          .then(() => {
            if (avatarFile) {
              imgur.upload(avatarFile[0].path, (err, img) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: avatarFile ? img.data.link : user.avatar,
                  cover: user.cover,
                }).then(() => {
                  return user.update({
                    name: req.body.name,
                    introduction: req.body.introduction,
                    cover: user.cover,
                    avatar: user.avatar,
                  }).then(() => {
                    return res.redirect(`/users/${req.params.id}`)
                  })
                })
              })
            } else {
              return user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                cover: user.cover,
                avatar: user.avatar,
              }).then(() => {
                return res.redirect(`/users/${req.params.id}`)
              })
            }
          })
      })
    }

    if (avatarFile) {
      imgur.upload(avatarFile[0].path, (err, img) => {
        return user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          avatar: avatarFile ? img.data.link : user.avatar,
          cover: user.cover,
        })
          .then(() => {
            if (coverFile) {
              imgur.upload(coverFile[0].path, (err, img) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  cover: coverFile ? img.data.link : user.cover,
                  avatar: user.avatar,
                }).then(() => {
                  return user.update({
                    name: req.body.name,
                    introduction: req.body.introduction,
                    cover: user.cover,
                    avatar: user.avatar,
                  }).then(() => {
                    return res.redirect(`/users/${req.params.id}`)
                  })
                })
              })
            } else {
              return user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                cover: user.cover,
                avatar: user.avatar,
              }).then(() => {
                return res.redirect(`/users/${req.params.id}`)
              })
            }
          })
      })
    }

    return user.update({
      name: req.body.name,
      introduction: req.body.introduction,
      cover: user.cover,
      avatar: user.avatar,
    }).then(() => {
      return res.redirect(`/users/${req.params.id}`)
    })
  },
  getEdit: (req, res) => {
    const id = req.params.id
    const userId = helper.getUser(req).id
    const selfUser = helper.getUser(req)
    axios.get(`http://localhost:3000/api/users/${id}?userId=${userId}`).then(function (response) {
      const data = response.data
      res.render('edit', { data, selfUser })
    })
  },
  putUserInfo: (req, res) => {
    const selfUser = helper.getUser(req)
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
    console.log(data)
    const errors = []

    if (password !== confirmPassword) {
      errors.push({ message: "Password doesn't match the confirm password." })
      console.log('password error')
    }
    if (errors.length) {
      return res.render('edit', { data, errors, selfUser })
    }
    User.findByPk(data.id).then(user => {
      user.update(data)
      res.redirect(`/users/${data.id}/tweets`)
    })
  }

}