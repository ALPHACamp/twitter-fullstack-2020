const { User, Tweet, Like, Reply, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../helpers/auth-helpers')
const userController = {
  getEditPage: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) throw new Error('沒有瀏覽權限!')
      const user = await User.findByPk(req.params.id, { raw: true })
      return res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) throw new Error('沒有編輯權限!')
      const { name, account, email, password, checkPassword } = req.body
      if (password !== checkPassword) throw new Error('密碼不相符!')
      if (name.length > 50) throw new Error('暱稱長度不可超過50個字!')

      const sameAccountUser = await User.findOne({ where: { account } })
      const sameEmailUser = await User.findOne({ where: { email } })
      if (sameEmailUser && sameEmailUser.id !== Number(req.params.id)) throw new Error('該Email已被使用!')
      if (sameAccountUser && sameAccountUser.id !== Number(req.params.id)) throw new Error('該帳號名稱已被使用!')

      const user = await User.findByPk(Number(req.params.id))
      if (!user) throw new Error('使用者不存在!')
      const updateInfo = {}
      if (password) {
        updateInfo.password = await bcrypt.hash(password, 10)
      }
      if (account) updateInfo.account = account
      if (name) updateInfo.name = name
      if (email) updateInfo.email = email
      await user.update(updateInfo)
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/api/users/${req.params.id}`)
    } catch (err) {
      next(err)
    }
  },
  getUserTweetsPage: (req, res, next) => {
    const id = req.params.userId
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
    ])
      .then(([user, users]) => {
        const topUsers = users
          .map(u => ({
            // 整理格式
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: u.Followers.length,
            // 判斷目前登入使用者是否已追蹤該 user 物件
            isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('users/tweets', { user: user.toJSON(), topUsers })
      })
      .catch(err => next(err))
  },
  getUserRepliesPage: (req, res, next) => {
    const id = req.params.userId
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply },
          { model: Reply, include: { model: Tweet, include: User } },
          {
            model: Like,
            include: [
              { model: Tweet, include: User },
              { model: Tweet, include: Reply },
              { model: Tweet, include: Like }
            ]
          },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
    ])
      .then(([user, users]) => {
        const topUsers = users
          .map(u => ({
            // 整理格式
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: u.Followers.length,
            // 判斷目前登入使用者是否已追蹤該 user 物件
            isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('users/replies', { user: user.toJSON(), topUsers })
      })
      .catch(err => next(err))
  },
  getUserLikesPage: (req, res, next) => {
    const id = req.params.userId
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
    ])
      .then(([user, users]) => {
        const topUsers = users
          .map(u => ({
            // 整理格式
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: u.Followers.length,
            // 判斷目前登入使用者是否已追蹤該 user 物件
            isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('users/likes', { user: user.toJSON(), topUsers })
      })
      .catch(err => next(err))
  },
  getUserFollowingsPage: async (req, res, next) => {
    try {
      const { userId } = req.params

      const user = await User.findByPk(userId, {
        include: [
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      const users = await User.findAll({ include: [{ model: User, as: 'Followers', include: Tweet }] })
      const topUsers = await users
        .map(u => ({
          // 整理格式
          ...u.toJSON(),
          name: u.name.substring(0, 20),
          account: u.account.substring(0, 20),
          // 計算追蹤者人數
          followerCount: u.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)

      const followships = await Followship.findAll({
        attributes: ['followingId'],
        where: { followerId: userId },
        raw: true
      })
      const followIdArr = []
      for (let i = 0; i < followships.length; i++) {
        followIdArr.push(Object.values(followships[i]))
      }
      const followId = await followIdArr.flat()

      const followingsTweets = await Tweet.findAll({
        include: User,
        where: { UserId: followId },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })

      return res.render('users/followings', { user: user.toJSON(), followingsTweets, topUsers })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowersPage: async (req, res, next) => {
    try {
      const { userId } = req.params

      const user = await User.findByPk(userId, {
        include: [
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      const users = await User.findAll({ include: [{ model: User, as: 'Followers', include: Tweet }] })
      const topUsers = await users
        .map(u => ({
          // 整理格式
          ...u.toJSON(),
          name: u.name.substring(0, 20),
          account: u.account.substring(0, 20),
          // 計算追蹤者人數
          followerCount: u.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)

      const followships = await Followship.findAll({
        attributes: ['followerId'],
        where: { followingId: userId },
        raw: true
      })
      const followIdArr = []
      for (let i = 0; i < followships.length; i++) {
        followIdArr.push(Object.values(followships[i]))
      }
      const followId = await followIdArr.flat()

      const followersTweets = await Tweet.findAll({
        include: User,
        where: { UserId: followId },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })

      return res.render('users/followers', { user: user.toJSON(), followersTweets, topUsers })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (user.id === req.user.id) throw new Error('You are not allowed to follow yourself!')
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }

}

module.exports = userController
