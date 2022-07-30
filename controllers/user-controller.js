const bcrypt = require('bcrypt-nodejs')
const helpers = require('../_helpers')
// const { imgurFileHandler } = require('../helpers/file-helpers')

const { User, Tweet, Like, Reply, Followship } = require('../models')

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      res.render('signup')
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      let { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password) {
        throw new Error('Please complete all required fields')
      }
      if (password !== checkPassword) throw new Error('Passwords do not match!')
      const existAccount = await User.findOne({ where: { account } })
      if (existAccount) throw new Error('Account already exists!')
      const existEmail = await User.findOne({ where: { email } })
      if (existEmail) throw new Error('Email already exists!')
      name = name.trim()
      if (name.length > 50) {
        throw new Error("Name can't have too many characters.")
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      const userData = { account, name, email, password: hash }
      await User.create(userData)
      req.flash('success_messages', '您已成功註冊帳號！')
      // return res.render('signin')
      res.redirect(302, '/signin')
      // delete userData.password
      // return res.json(userData)
    } catch (err) {
      next(err)
    }
  },
  signInPage: async (req, res, next) => {
    try {
      res.render('signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
      // const userData = req.user.toJSON()
      // delete userData.password
      // res.json({
      //   status: 'success',
      //   data: {
      //     user: userData
      //   }
      // })
    } catch (err) {
      next(err)
    }
  },
  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登出！')
      req.logout()
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const userId = Number(helpers.getUser(req).id)
      const role = helpers.getUser(req).role
      const queryUserId = Number(req.params.id)
      const queryUserData = await User.findByPk(queryUserId, {
        include: [{
          model: User,
          as: 'Followings',
          attributes: ['id', 'name', 'avatar', 'introduction'],
          order: [['createdAt', 'DESC']]
        },
        { model: Tweet, attributes: ['id'] }
        ]
      })
      if (!queryUserData) throw new Error('使用者不存在 !')

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)
      queryUser.Followings.forEach(user => {
        user.isFollowed = helpers
          .getUser(req)
          .Followings.some(item => item.id === user.id)
        user.isSelf = user.id === userId
      })
      let topUser = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      topUser = topUser
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: currentUser.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      let profileUser = await User.findByPk(userId, {
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] }
        ]
      })
      return res.render('users/user-followings', { queryUser, role, currentUser, topUser })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const userId = Number(helpers.getUser(req).id)
      const role = helpers.getUser(req).role
      const queryUserId = Number(req.params.id)
      const queryUserData = await User.findByPk(queryUserId, {
        include: [{
          model: User,
          as: 'Followers',
          attributes: ['id', 'name', 'avatar', 'introduction'],
          order: [['createdAt', 'DESC']]
        },
        { model: Tweet, attributes: ['id'] }
        ]
      })
      if (!queryUserData) throw new Error('使用者不存在 !')

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)
      queryUser.Followers.forEach(user => {
        user.isFollowed = helpers
          .getUser(req)
          .Followings.some(item => item.id === user.id)
        user.isSelf = user.id === userId
      })
      let topUser = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      topUser = topUser
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: currentUser.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      let profileUser = await User.findByPk(userId, {
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] }
        ]
      })
      return res.render('users/user-followers', { queryUser, role, currentUser, topUser })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const userId = Number(req.params.id)
      let topUser = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      topUser = topUser
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: currentUser.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      let profileUser = await User.findByPk(userId, {
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] }
        ]
      })
      if (!profileUser) throw new Error("This user didn't exist!")
      profileUser = profileUser.toJSON()
      if (currentUser.Followings.some(fr => fr.id === profileUser.id)) {
        profileUser.isFollowed = true
      }
      const userTweets = await Tweet.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'description', 'createdAt'],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      const likedTweetsId = req.user?.Likes ? currentUser.Likes.map(lt => lt.TweetId) : []
      const data = userTweets.map(tweets => ({
        ...tweets.toJSON(),
        isLiked: likedTweetsId.includes(tweets.id)
      }))
      console.log(topUser)
      res.render('users/user-tweets', {
        tweets: data,
        role: currentUser.role,
        currentUser,
        profileUser,
        topUser,
        tab: 'tweets'
      })
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const userId = Number(req.params.id)
      let topUser = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      topUser = topUser
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: currentUser.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      let profileUser = await User.findByPk(userId, {
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] }
        ]
      })
      if (!profileUser) throw new Error("This user didn't exist!")
      profileUser = profileUser.toJSON()
      if (profileUser.Followers.map(fr => fr.id === currentUser.id)) {
        profileUser.isFollowed = true
      }
      const userTweets = await Tweet.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'description', 'createdAt'],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      const likedTweetsId = req.user?.Likes ? currentUser.Likes.map(lt => lt.TweetId) : []
      const data = userTweets.map(tweets => ({
        ...tweets.toJSON(),
        isLiked: likedTweetsId.includes(tweets.id)
      }))
      res.render('users/user-tweets', {
        tweets: data,
        role: currentUser.role,
        currentUser,
        profileUser,
        topUser,
        tab: 'likes'
      })
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const userId = Number(req.params.id)
      let topUser = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      topUser = topUser
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: currentUser.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      let profileUser = await User.findByPk(userId, {
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] }
        ]
      })
      if (!profileUser) throw new Error("This user didn't exist!")
      profileUser = profileUser.toJSON()
      if (profileUser.Followers.map(fr => fr.id === currentUser.id)) {
        profileUser.isFollowed = true
      }
      const userTweets = await Tweet.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'description', 'createdAt'],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      const likedTweetsId = req.user?.Likes ? currentUser.Likes.map(lt => lt.TweetId) : []
      const data = userTweets.map(tweets => ({
        ...tweets.toJSON(),
        isLiked: likedTweetsId.includes(tweets.id)
      }))
      res.render('users/user-tweets', {
        tweets: data,
        role: currentUser.role,
        currentUser,
        profileUser,
        topUser,
        tab: 'replies'
      })
    } catch (err) {
      next(err)
    }
  },
  postFollow: async (req, res, next) => {
    try {
      const UserId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)
      if (UserId === followingId) {
        req.flash('error_messages', "You can't follow yourself")
        return res.redirect(200, 'back')
      }

      const user = await User.findByPk(followingId)
      if (!user) throw new Error("User didn't exist")
      if (user.role === 'admin') {
        req.flash('error_messages', "You can't follow admin")
        return res.redirect('back')
      }

      const isFollowed = await Followship.findOne({
        where: { followerId: UserId, followingId }
      })

      if (isFollowed) {
        await isFollowed.destroy()
        return res.redirect('back')
      }

      await Followship.create({
        followerId: UserId,
        followingId
      })
      return res.redirect('/')
    } catch (err) {
      next(err)
    }
  },
  postUnfollow: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const followingId = Number(req.params.id)
      const user = await User.findByPk(followingId)
      if (!user) throw new Error("User didn't exist")
      const followship = await Followship.findOne({
        where: { followerId: UserId, followingId }
      })
      if (!followship) throw new Error("You haven't follow this user")
      const destroyedFollowship = await followship.destroy()
      return res.status(302).json({ status: 'success', destroyedFollowship })
      // res.json({ status: 'success', destroyedFollowship })
    } catch (err) {
      next(err)
    }
  },
  getUserSettingPage: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      res.render('users/user-setting', { role: currentUser.role, currentUser })
    } catch (err) {
      next(err)
    }
  },
  patchUserSetting: async (req, res, next) => {
    try {
      const currentUserId = Number(helpers.getUser(req).id)
      const userId = Number(req.params.id)
      if (currentUserId !== userId) {
        throw new Error("Can not edit other user's account!")
      }
      let { account, name, email, password, checkPassword } = req.body

      if (!account || !email || !name) {
        throw new Error('Please complete all required fields')
      }

      if (password !== checkPassword) throw new Error('Passwords do not match!')

      const existAccount = await User.findOne({
        where: { account: account || null }
      })
      if (existAccount && Number(existAccount.id) !== currentUserId) {
        throw new Error('Account already exists!')
      }

      const existEmail = await User.findOne({ where: { email: email || null } })
      if (existEmail && Number(existEmail.id) !== currentUserId) {
        throw new Error('Email already exists!')
      }

      name = name.trim()
      if (name.length > 50) {
        throw new Error("Name can't have too many characters.")
      }

      const newUserData = { account, name, email }
      if (password.length) {
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        newUserData.password = hash
      }
      const userData = await User.findByPk(userId)
      await userData.update(newUserData)
      req.flash('success_messages', '帳號重新編輯成功！')
      return res.redirect(`/users/${currentUserId}/tweets`)
    } catch (err) {
      next(err)
    }
  },
  getTopUser: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      let topUser = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      topUser = topUser
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: currentUser.Followings.some(f => f.id === user.id),
          password: null
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      res.json({ status: 'success', topUser, currentUser })
      // res.render('tweets', { topUser, currentUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
