const { User, Tweet, Like, Reply, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  getEditPage: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) throw new Error('沒有瀏覽權限!')
      const reqUser = req.user
      const user = await User.findByPk(req.params.id, { raw: true })
      return res.render('users/edit', { user, reqUser })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) throw new Error('沒有編輯權限!')
      const { name, account, email, password, checkPassword, introduction } = req.body
      if (password !== checkPassword) throw new Error('密碼不相符!')
      if (name.length > 50) throw new Error('暱稱長度不可超過50個字!')

      const user = await User.findByPk(Number(req.params.id))
      if (!user) throw new Error('使用者不存在!')

      const updateInfo = {}
      if (name) updateInfo.name = name
      if (password) updateInfo.password = await bcrypt.hash(password, 10)
      if (introduction) updateInfo.introduction = introduction
      if (account) {
        const sameAccountUser = await User.findOne({ where: { account } })
        if (sameAccountUser && sameAccountUser.id !== Number(req.params.id)) throw new Error('該帳號名稱已被使用!')
        updateInfo.account = account
      }
      if (email) {
        const sameEmailUser = await User.findOne({ where: { email } })
        if (sameEmailUser && sameEmailUser.id !== Number(req.params.id)) throw new Error('該Email已被使用!')
        updateInfo.email = email
      }

      const { avatar, cover } = req.files
      if (avatar) {
        const avatarFilePath = await imgurFileHandler(...avatar)
        updateInfo.avatar = avatarFilePath
      }
      if (cover) {
        const coverFilePath = await imgurFileHandler(...cover)
        updateInfo.cover = coverFilePath
      }
      await user.update(updateInfo)
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getUserTweetsPage: async (req, res, next) => {
    try {
      const reqUser = req.user
      const { userId } = req.params
      // info area
      const user = await User.findByPk(userId, {
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      // tweet area
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [User, Reply, Like],
        where: { userId: userId }
      })

      const myLikedTweets = await Like.findAll({
        where: { userId: reqUser.id }
      })
      const myLikedTweetsId = myLikedTweets.map(l => l.tweetId)

      const tweetsResult = tweets
        .map(t => ({
          ...t.toJSON(),
          // likesCount: t.Like.length,
          isLiked: myLikedTweetsId && myLikedTweetsId.some(l => l === t.id)
        }))
      // top10users area
      const users = await User.findAll({ include: [{ model: User, as: 'Followers' }], where: { role: 'user' } })
      const topUsers = users
        .map(u => ({
          ...u.toJSON(),
          name: u.name.substring(0, 20),
          account: u.account.substring(0, 20),
          // 計算追蹤者人數
          followerCount: u.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)

      return res.render('users/tweets', { user: user.toJSON(), tweets: tweetsResult, topUsers, reqUser })
    } catch (err) {
      next(err)
    }
  },
  getUserRepliesPage: (req, res, next) => {
    const reqUser = req.user
    const id = req.params.userId
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: Tweet, include: Reply },
          { model: Reply, include: { model: Tweet, include: User } },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      User.findAll({ include: [{ model: User, as: 'Followers' }], where: { role: 'user' } })
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
        return res.render('users/replies', { user: user.toJSON(), topUsers, reqUser })
      })
      .catch(err => next(err))
  },
  getUserLikesPage: async (req, res, next) => {
    try {
      const reqUser = req.user
      const { userId } = req.params
      // info area
      const user = await User.findByPk(userId, {
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      // likedtweet area
      const likes = await Like.findAll({
        where: { userId: userId },
        raw: true,
        nest: true //
      })
      const likedTweetsId = likes.map(like => like.tweetId)
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [User, Reply, Like],
        where: { id: likedTweetsId }
      })
      const myLikedTweets = await Like.findAll({
        where: { userId: reqUser.id }
      })
      const myLikedTweetsId = myLikedTweets.map(l => l.tweetId)
      const tweetsResult = tweets
        .map(t => ({
          ...t.toJSON(),
          isLiked: myLikedTweetsId && myLikedTweetsId.some(l => l === t.id)
        }))
      // top10users area
      const users = await User.findAll({ include: [{ model: User, as: 'Followers' }], where: { role: 'user' } })
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

      return res.render('users/likes', { user: user.toJSON(), tweets: tweetsResult, topUsers, reqUser })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowingsPage: async (req, res, next) => {
    try {
      const reqUser = req.user
      const { userId } = req.params
      // header area
      const user = await User.findByPk(userId, {
        include: Tweet
      })
      // tweet area
      const followships = await Followship.findAll({
        where: { followerId: userId },
        raw: true
      })
      const followingsId = followships.map(followship => followship.followingId)
      const tweets = await Tweet.findAll({
        include: User,
        where: { UserId: followingsId },
        order: [['createdAt', 'DESC']]
      })
      const tweetsResult = tweets
        .map(t => ({
          ...t.toJSON(),
          isFollowed: req.user && req.user.Followings.some(f => f.id === t.userId)
        }))
      // top10users area
      const users = await User.findAll({ include: [{ model: User, as: 'Followers' }], where: { role: 'user' } })
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

      return res.render('users/followings', { user: user.toJSON(), tweets: tweetsResult, topUsers, reqUser })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowersPage: async (req, res, next) => {
    try {
      const reqUser = req.user
      const { userId } = req.params
      // header area
      const user = await User.findByPk(userId, {
        include: Tweet
      })
      // tweet area
      const followships = await Followship.findAll({
        where: { followingId: userId },
        raw: true
      })
      const followersId = followships.map(followship => followship.followerId)
      const tweets = await Tweet.findAll({
        include: User,
        where: { UserId: followersId },
        order: [['createdAt', 'DESC']]
      })
      const tweetsResult = tweets
        .map(t => ({
          ...t.toJSON(),
          isFollowed: req.user && req.user.Followings.some(f => f.id === t.userId)
        }))
      // top10users area
      const users = await User.findAll({ include: [{ model: User, as: 'Followers'}], where: { role: 'user' } })
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

      return res.render('users/followers', { user: user.toJSON(), tweets: tweetsResult, topUsers, reqUser })
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
