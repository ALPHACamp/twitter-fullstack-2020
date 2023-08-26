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
  getUser: (req, res, next) => {
    const id = req.params.userId
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
        // where: { userId: id }
      }),
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
    ])
      .then(([user, users]) => {
        // const followerCount = { followerCount: user.Followers.length }
        // const followingCount = { followerCount: user.Followings.length }
        // user.push(followerCount, followingCount)
        const topUsers = users
          .map(u => ({
            // 整理格式
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: user.Followers.length,
            // 判斷目前登入使用者是否已追蹤該 user 物件
            isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('users/tweets', { user: user.toJSON(), topUsers })
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const id = req.params.userId
    return User.findByPk(id, {
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
        }
      ]
      // where: { userId: id }
    })
      .then(user => res.render('users/replies', { user: user.toJSON() })
      )
  },
  getUserLikes: (req, res, next) => {
    const id = req.params.userId
    return User.findByPk(id, {
      include: [
        { model: Tweet, include: Like },
        { model: Tweet, include: Reply }
      ]
      // where: { userId: id }
    })
      .then(user => res.render('users/likes', { user: user.toJSON() })
      )
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    Promise.all([
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
    Followship.findOne({
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
