const { User, Tweet, Reply, Like, Followship } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userController = {
  getUser: (req, res, next) => {
    const { type } = req.query
    let tweetsSelect, relpiesSelect, likesSelect

    if (type === 'relpies') {
      relpiesSelect = true
    } else if (type === 'likes') {
      likesSelect = true
    } else {
      tweetsSelect = true
    }

    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet, include: [Reply, Like] },
          { model: Reply, include: { model: Tweet, include: [User] } },
          { model: Like, include: { model: Tweet, include: [User, Reply, Like] } },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [
          [Tweet, 'createdAt', 'DESC'],
          [Reply, 'createdAt', 'DESC'],
          [Like, 'createdAt', 'DESC']
        ]
      }),
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([user, users]) => {
        const LIMIT = 10

        user = {
          ...user.toJSON(),
          followerCount: user.Followers.length,
          followingCount: user.Followings.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }

        const result = users
          .map(item => ({
            ...item.toJSON(),
            followerCount: item.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === item.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, LIMIT)

        res.render('user', { user, users: result, tweetsSelect, relpiesSelect, likesSelect })
      })
      .catch(err => next(err))
  },
  getUserFollowship: (req, res, next) => {
    const { type } = req.query
    let followersSelect, followingsSelect

    if (type === 'followers') {
      followersSelect = true
    } else {
      followingsSelect = true
    }

    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet, include: [Reply, Like] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [
          ['Followers', Followship, 'createdAt', 'DESC'],
          ['Followings', Followship, 'createdAt', 'DESC']
        ]
      }),
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([user, users]) => {
        const LIMIT = 10
        const useData = user.toJSON()

        user = {
          ...useData,
          Followers: useData.Followers.map(follower => ({
            ...follower,
            isFollowersFollowed: req.user.Followings.some(f => f.id === follower.Followship.followerId)
          })),
          Followings: useData.Followings.map(following => ({
            ...following,
            isFollowingsFollowed: req.user.Followings.some(f => f.id === following.Followship.followingId)
          }))
        }

        const result = users
          .map(item => ({
            ...item.toJSON(),
            followerCount: item.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === item.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, LIMIT)

        res.render('followship', { user, users: result, followersSelect, followingsSelect })
      })
      .catch(err => next(err))
  },
  editUserSetting: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('setting', { user })
      })
      .catch(err => next(err))
  },
  putUserSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (Number(req.params.id) !== Number(req.user.id)) throw new Error('請勿編輯他人資料')
    if (name.length > 50) throw new Error('名稱字數超出上限！')
    if (password !== checkPassword) throw new Error('Passwords do not match!')

    return Promise.all([
      User.findByPk(req.params.id),
      User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
    ])
      .then(([user, newUser]) => {
        if (newUser) throw new Error('account 或 email 已重複註冊！')

        bcrypt.hash(password, 10)
          .then(hash => {
            return user.update({
              email,
              password: hash,
              name,
              avatar: user.avatar,
              cover: user.cover,
              introduction: user.introduction,
              role: user.role,
              account
            })
          })
          .then(() => {
            req.flash('success_messages', '使用者資料編輯成功')
            res.redirect(`/users/${req.params.id}`)
          })
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    return Promise.all([
      Tweet.findByPk(req.params.id),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have liked this tweet!')

        return Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Promise.all([
      Tweet.findByPk(req.params.id),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (!like) throw new Error("You haven't liked this tweet")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.body.id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (Number(req.body.id) === Number(helpers.getUser(req).id)) {
          req.flash('error_messages', "Can't following yourself!")
          return res.redirect(200, 'back')
        }
        if (followship) throw new Error('You are already following this user!')

        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.userId),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (Number(req.params.userId) === Number(helpers.getUser(req).id)) {
          req.flash('error_messages', "Can't delete your follower!")
          return res.redirect(200, 'back')
        }
        if (!followship) throw new Error("You haven't followed this user!")

        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
