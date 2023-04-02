const { User, Tweet, Reply, Like, Sequelize } = require('../../models')
const bcrypt = require('bcryptjs') //載入 bcrypt
const dateFormatter = require('../../helpers/dateFormatter')
const helpers = require('../../_helpers')
const { Op } = require('sequelize')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup', { layout: 'signin-main' })
  },
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
      let user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('email已存在')
      user = await User.findOne({ where: { account: req.body.account } })
      if (user) throw new Error('帳號已存在')
      hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        account: req.body.name,
        name: req.body.name,
        email: req.body.email,
        password: hash
      })

      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (error) {

      console.log(error)
      next(error)
    }
  },
  signInPage: (req, res) => {
    res.render('signin', { layout: 'signin-main' })
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

  getUserTweets: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Tweet,
            include: [{ model: Reply }, { model: User }, { model: Like }]
          },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[{ model: Tweet }, 'createdAt', 'DESC']],
        nest: true
      })
      user = user.toJSON()
      const userTweets = user.Tweets.map(tweet => ({
        ...tweet,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        isLiked: tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)
      }))

      userTweets.forEach(tweet => {
        dateFormatter(tweet, 8)
      })

      user.followerCount = user.Followers.length
      user.followingCount = user.Followings.length
      user.isSelf = helpers.getUser(req).id === user.id
      user.isFollowed = user.Followers.some(fr => fr.id === helpers.getUser(req).id)

      res.render('user-profile', { tweets: userTweets, user, isTweets: true, isProfile: true })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },

  getUserReplies: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Reply,
            include: [
              {
                model: Tweet,
                include: { model: User }
              },
              { model: User }
            ],
          },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[{ model: Reply }, 'createdAt', 'DESC']],
        nest: true
      })
      user = user.toJSON()
      const userReplies = user.Replies
      userReplies.forEach(reply => {
        dateFormatter(reply, 8)
      })

      user.followerCount = user.Followers.length
      user.followingCount = user.Followings.length

      res.render('user-profile', { replies: userReplies, user, isReplies: true, isProfile: true })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Like, include:
            {
              model: Tweet,
              include: [{ model: Reply }, { model: Like }, { model: User }]
            }
          },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        nest: true
      })
      user = user.toJSON()
      user.Likes.sort((a, b) => b.createdAt - a.createdAt)
      const likedTweets = user.Likes.map(like => ({
        ...like.Tweet,
        replyCount: like.Tweet.Replies.length,
        likeCount: like.Tweet.Likes.length,
        isLiked: like.Tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)
      }))


      likedTweets.forEach(reply => {
        dateFormatter(reply, 8)
      })

      user.followerCount = user.Followers.length
      user.followingCount = user.Followings.length

      res.render('user-profile', { tweets: likedTweets, user, isLikes: true, isProfile: true })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: User,
          as: 'Followers',
          include: { model: User, as: 'Followers' }
        },
        order: [[{ model: User, as: 'Followers' }, 'account', 'ASC']],
        nest: true
      })
      if (!user) throw new Error('User not found')
      const followers = user.toJSON().Followers

      followers.forEach(follower =>
        follower.isFollowed = follower.Followers.some(fr => fr.id === req.params.id)
      )
      followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      res.render('followship', { user: user.toJSON(), users: followers, isFollowers: true, isProfile: true })
    } catch (error) {

      console.log(error)
      next(error)
    }
  },

  getUserFollowings: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: User,
          as: 'Followings',
        },
        order: [[{ model: User, as: 'Followings' }, 'account', 'ASC']],
        nest: true
      })
      if (!user) throw new Error('User not found')
      const followings = user.toJSON().Followings


      followings.forEach(following =>
        following.isFollowed = true
      )

      followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      res.render('followship', { user: user.toJSON(), users: followings, isFollowings: true, isProfile: true })
    } catch (error) {

      console.log(error)
      next(error)
    }
  },
  settingPage: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const findUser = await User.findByPk(loginUser.id, { raw: true })
      if (!findUser) throw new Error('Can not find user!')
      return res.render('setting', { findUser, isSetting: true })
    } catch (err) {
      next(err)
    }
  },
  setting: async (req, res, next) => {
    try {
      const { account, name, email, password, confirmpassword } = req.body
      if (!account || !name || !email || !password || !confirmpassword) throw new Error('All column is required!')
      if (password !== confirmpassword) throw new Error('Password do not match to confirm password')
      const loginUser = helpers.getUser(req)
      const user = await User.findByPk(loginUser.id)
      if (!user) throw new Error('Cannot find user!')
      const hash = await bcrypt.hash(req.body.password, 10)
      await user.update({
        account,
        name,
        email,
        password: hash
      })
      console.log('setting!')
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
module.exports = userController


