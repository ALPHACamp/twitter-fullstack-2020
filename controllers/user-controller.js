const bcrypt = require('bcrypt-nodejs')
const helpers = require('../_helpers')
const getTopUser = require('../helpers/top-user-helper')

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
      const avatar = '/pic/no_pic.png'
      const coverPhoto = '/pic/default_cover_photo.png'
      if (!account || !name || !email || !password) {
        req.flash('error_messages', 'Please complete all required fields')
        res.render('signup', { account, name, email })
      }
      if (password !== checkPassword) {
        req.flash('error_messages', 'Passwords do not match!')
        res.render('signup', { account, name, email })
      }

      account = account.replace(/^\s+|\s+$/g, '')
      name = name.replace(/[^\w_]/g, '')
      password = password.replace(/[\u4e00-\u9fa5]/g, '')
      checkPassword = checkPassword.replace(/[\u4e00-\u9fa5]/g, '')

      const existAccount = await User.findOne({ where: { account } })
      if (existAccount) {
        const error_messages = 'Account already exists!'
        return res.render('signup', { name, email, error_messages })
      }
      const existEmail = await User.findOne({ where: { email } })
      if (existEmail) {
        const error_messages = ('Email already exists!')
        return res.render('signup', { account, name, error_messages })
      }
      if (name.length > 50) {
        const error_messages = ("Name can't have too many characters.")
        return res.render('signup', { account, email, error_messages })
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      const userData = {
        account,
        name,
        email,
        password: hash,
        avatar,
        coverPhoto
      }
      await User.create(userData)
      req.flash('success_messages', '您已成功註冊帳號！')
      return res.redirect(302, '/signin')
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
        include: [
          {
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
      const topUser = await getTopUser(currentUser)
      return res.render('users/user-followings', {
        queryUser,
        role,
        currentUser,
        topUser
      })
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
        include: [
          {
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
      const topUser = await getTopUser(currentUser)
      return res.render('users/user-followers', {
        queryUser,
        role,
        currentUser,
        topUser
      })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const userId = Number(req.params.id)
      const topUser = await getTopUser(currentUser)
      let profileUser = await User.findByPk(userId, {
        include: [
          {
            model: Tweet,
            include: [
              { model: Like, attributes: ['id'] },
              { model: Reply, attributes: ['id'] },
              { model: User, attributes: ['avatar'] }
            ]
          },
          { model: User, attributes: ['id'], as: 'Followers' },
          { model: User, attributes: ['id'], as: 'Followings' }
        ],
        order: [[Tweet, 'createdAt', 'DESC']]
      })
      if (!profileUser) throw new Error("This user didn't exist!")
      profileUser = profileUser.toJSON()
      if (currentUser.Followings.some(fr => fr.id === profileUser.id)) {
        profileUser.isFollowed = true
      }
      const likedTweetsId = profileUser?.Likes
        ? currentUser.Likes.map(lt => lt.TweetId)
        : []
      profileUser.Tweets = profileUser.Tweets.map(tweets => ({
        ...tweets,
        isLiked: likedTweetsId.includes(tweets.id)
      }))
      res.render('users/user-tweets', {
        profileUser,
        role: currentUser.role,
        currentUser,
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
      const topUser = await getTopUser(currentUser)
      let profileUser = await User.findByPk(userId, {
        include: [
          {
            model: Tweet,
            include: [{ model: Like }, { model: Reply, attributes: ['id'] }]
          },
          { model: User, attributes: ['id'], as: 'Followers' },
          { model: User, attributes: ['id'], as: 'Followings' }
        ]
      })
      if (!profileUser) throw new Error("This user didn't exist!")
      profileUser = profileUser.toJSON()
      if (currentUser.Followings.some(fr => fr.id === profileUser.id)) {
        profileUser.isFollowed = true
      }
      const likedTweets = await Like.findAll({
        where: { UserId: userId },
        attributes: ['id', 'createdAt'],
        include: [
          {
            model: Tweet,
            attributes: ['id', 'description', 'createdAt'],
            include: [
              { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
              { model: Reply, attributes: ['id'] },
              { model: Like, attributes: ['id'] }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      likedTweets.forEach(function (tweet, index) {
        this[index] = {
          ...tweet.toJSON()
        }
      }, likedTweets)
      res.render('users/user-likes', {
        likedTweets,
        profileUser,
        role: currentUser.role,
        currentUser,
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
      const topUser = await getTopUser(currentUser)
      let profileUser = await User.findByPk(userId, {
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: [
              { model: Like, attributes: ['id'] },
              { model: Reply, attributes: ['id'] }
            ]
          },
          { model: User, attributes: ['id'], as: 'Followers' },
          { model: User, attributes: ['id'], as: 'Followings' }
        ]
      })
      if (!profileUser) throw new Error("This user didn't exist!")
      profileUser = profileUser.toJSON()
      if (currentUser.Followings.some(fr => fr.id === profileUser.id)) {
        profileUser.isFollowed = true
      }
      const repliedTweets = await Reply.findAll({
        where: { UserId: userId },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          },
          {
            model: Tweet,
            include: [{ model: User, attributes: ['id', 'account'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      repliedTweets.forEach(function (reply, index) {
        this[index] = { ...reply.toJSON() }
      }, repliedTweets)
      res.render('users/user-replies', {
        repliedTweets,
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

      account = account.replace(/[^\w_]/g, '')
      name = name.replace(/^\s+|\s+$/g, '')
      password = password.replace(/[\u4e00-\u9fa5]/g, '')
      checkPassword = checkPassword.replace(/[\u4e00-\u9fa5]/g, '')

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
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
