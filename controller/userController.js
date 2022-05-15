const bcrypt = require('bcryptjs')
const { Tweet, User, Like, Reply, Followship } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signUpPage: async (req, res) => {
    try {
      return res.render('signup', { status: 200 })
    } catch (err) {
      res.status(302)
      // console.log('err')
      return res.redirect('back')
    }
  },
  signUp: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      const errors = []

      if (!name || !email || !password || !checkPassword || !account) {
        errors.push({ message: '所有欄位都是必填。' })
      }
      if (password !== checkPassword) {
        errors.push({ message: '密碼與確認密碼不相符！' })
      }
      if (name.length > 50) {
        errors.push({ message: '名稱上限為50字！' })
      }

      const userEmail = await User.findOne({ where: { email } })
      const userAccount = await User.findOne({ where: { account } })
      if (userEmail) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
      }
      if (userAccount) {
        errors.push({ message: '這個 Account 已經註冊過了。' })
      }
      if (errors.length) {
        return res.render('signup', {
          errors,
          account,
          name,
          email,
          password,
          checkPassword
        })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        ),
        avatar:
          'https://icon-library.com/images/default-user-icon/default-user-icon-17.jpg'
      })

      req.flash('success_messages', '註冊成功！')
      res.status(200)
      res.redirect('/signin')
    } catch (err) {
      res.status(302)
      // console.log('err')
      return res.redirect('back')
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
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
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const paramsUser = await User.findByPk(userId, {
        include: [
          {
            model: Tweet,
            include: [{ model: Reply, attributes: ['id'] }, { model: Like, attributes: ['id'] }]
          },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] }
        ],
        order: [
          [Tweet, 'createdAt', 'DESC']
        ]
      })
      if (!paramsUser) throw new Error("user didn't exist!")
      const isFollowed = helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(userId))

      // 右側Top10User
      const users = await User.findAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: { model: User, as: 'Followers' }
      })
      const topUsers = users.map(user => { return user.get({ plain: true }) }).map(u => {
        return {
          ...u,
          Followers: u.Followers.length,
          isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(u.id))
        }
      }).sort((a, b) => b.Followers - a.Followers).slice(0, 10)

      return res.render('user', {
        user: paramsUser.toJSON(),
        isFollowed,
        topUsers
      })
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Like,
            include: [
              {
                model: Tweet,
                include: [
                  { model: User, attributes: ['id', 'name', 'account'] },
                  { model: Reply, attributes: ['id'] }
                ]
              }]
          },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] }
        ],
        order: [
          [Like, 'createdAt', 'DESC']
        ]
      })
      if (!user) throw new Error("user didn't exist!")
      const isFollowed = helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(userId))

      // 右側topUsers, sort by跟隨者follower數量 & isFollowed 按鈕
      const users = await User.findAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: { model: User, as: 'Followers' }
      })
      const topUsers = users.map(user => { return user.get({ plain: true }) }).map(u => {
        return {
          ...u,
          Followers: u.Followers.length,
          isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(u.id))
        }
      }).sort((a, b) => b.Followers - a.Followers).slice(0, 10)
      return res.render('likes', {
        user: user.toJSON(),
        tweets: user.toJSON().Likes,
        isFollowed,
        topUsers
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'avatar', 'account', 'cover', 'introduction'],
        include: [
          {
            model: Reply,
            attributes: ['comment', 'createdAt'],
            include: [{
              model: Tweet,
              attributes: ['description'],
              include: [{
                model: User,
                attributes: ['id', 'account']
              }]
            }]
          },
          { model: Tweet, attributes: ['description', 'createdAt'], order: ['createdAt', 'ASC'] },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] }
        ],
        order: [
          [Reply, 'createdAt', 'DESC']
        ]
      })
      if (!user) throw new Error("user didn't exist!")
      const isFollowed = helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(userId))

      // 右側topUsers, sort by跟隨者follower數量 & isFollowed 按鈕
      const users = await User.findAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: { model: User, as: 'Followers' }
      })
      const topUsers = users.map(user => { return user.get({ plain: true }) }).map(u => {
        return {
          ...u,
          Followers: u.Followers.length,
          isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(u.id))
        }
      }).sort((a, b) => b.Followers - a.Followers).slice(0, 10)
      return res.render('replies', {
        user: user.toJSON(),
        isFollowed,
        topUsers
      })
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const { tweetId } = req.params
      const like = await Like.findOne({
        where: {
          userId: helpers.getUser(req) && helpers.getUser(req).id,
          tweetId: tweetId
        }
      })
      if (like) {
        return res.redirect('back')
      }
      await Like.create({
        UserId: helpers.getUser(req) && helpers.getUser(req).id,
        TweetId: tweetId
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const { tweetId } = req.params
      const like = await Like.findOne({
        where: {
          userId: helpers.getUser(req) && helpers.getUser(req).id,
          tweetId: tweetId
        }
      })
      if (!like) {
        return res.redirect('back')
      }
      await like.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const id = req.params.id || req.body.id
      const loginUserId = helpers.getUser(req) && helpers.getUser(req).id

      if (id === loginUserId.toString()) {
        return res.redirect(200, 'back')
      }

      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exist!")

      const followship = await Followship.findOne({
        where: {
          followerId: loginUserId,
          followingId: id
        }
      })
      if (followship) throw new Error('You are already following this user!')

      await Followship.create({
        followerId: loginUserId,
        followingId: id
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req) && helpers.getUser(req).id,
          followingId: req.params.id
        }
      })
      if (!followship) throw new Error("You haven't followed this user!")
      await followship.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const currentUserId = req.params.id
      const currentUser = await User.findByPk(currentUserId, {
        attributes: ['id', 'name', 'account'],
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: ['id', 'avatar', 'name', 'account', 'introduction']
          },
          { model: Tweet, attributes: ['id'] }
        ]
      })
      const data = currentUser.toJSON().Followings.map(cf => ({
        ...cf,
        isFollowed:  helpers.getUser(req) && helpers.getUser(req).Followers && helpers.getUser(req).Followings.some(f => f.id === cf.id)
      }))
      // console.log('data', data)
      
      // 右側Top10User
      const users = await User.findAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: { model: User, as: 'Followers' }
      })
      const topUsers = users.map(user => { return user.get({ plain: true }) }).map(u => {
        return {
          ...u,
          Followers: u.Followers.length,
          isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(u.id))
        }
      }).sort((a, b) => b.Followers - a.Followers).slice(0, 10)

      return res.render('followings', {
        currentUser: currentUser.toJSON(),
        followings: data,
        currentUserId,
        topUsers
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const currentUserId = req.params.id
      const currentUser = await User.findByPk(currentUserId, {
        attributes: ['id', 'name', 'account'],
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id', 'avatar', 'name', 'account', 'introduction'],
            order: ['createdAt', 'DESC']
          },
          { model: Tweet, attributes: ['id'] }
        ]
      })
      const data = currentUser.toJSON().Followers.map(cf => ({
        ...cf,
        isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === cf.id)
      }))

      
      // 右側Top10User
      const users = await User.findAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: { model: User, as: 'Followers' }
      })
      const topUsers = users.map(user => { return user.get({ plain: true }) }).map(u => {
        return {
          ...u,
          Followers: u.Followers.length,
          isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings && helpers.getUser(req).Followings.some(f => f.id === Number(u.id))
        }
      }).sort((a, b) => b.Followers - a.Followers).slice(0, 10)

      return res.render('followers', {
        currentUser: currentUser.toJSON(),
        followers: data,
        currentUserId,
        topUsers
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
