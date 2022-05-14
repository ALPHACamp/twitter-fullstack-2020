const { User, Tweet, Reply, Like, Followship } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')

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
          followingCount: user.Followings.length
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
  }
}

module.exports = userController
