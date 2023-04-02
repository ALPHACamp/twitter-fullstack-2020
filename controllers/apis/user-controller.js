const { sequelize, User, Tweet, Reply, Followship, Like, Sequelize } = require('../../models')
const helpers = require('../../_helpers')
const userServices = require('../../services/user-services')
const dateFormatter = require('../../helpers/dateFormatter')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const userController = {


  addFollowing: async (req, res, next) => {
    try {

      if (req.body.id.toString() === helpers.getUser(req).id.toString()) {
        res.status(200).json({ message: '不能追蹤自己' })
      }

      else {
        let user = await User.findByPk(req.body.id)
        const followship = await Followship.findOne({
          where: { followerId: helpers.getUser(req).id, followingId: req.body.id }
        })
        if (!user) throw new Error("User doesn't exist!")

        if (!followship) {
          await Followship.create({ followerId: helpers.getUser(req).id, followingId: req.body.id })
        }
        user = await User.findByPk(req.body.id, {
          include: {
            model: User,
            as: 'Followers'
          }
        })

        const isFollowed = user.Followers.some(fr => fr.id === helpers.getUser(req).id)
        res.status(302).json({
          followerCount: user.Followers.length,
          isFollowed
        })
      }

    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: error.message
      })
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id)
      const followship = await Followship.findOne({
        where: { followerId: helpers.getUser(req).id, followingId: req.params.id }
      })
      if (!user) throw new Error("User doesn't exist!")
      if (followship) await followship.destroy()
      user = await User.findByPk(req.params.id, {
        include: {
          model: User,
          as: 'Followers'
        }
      })

      const isFollowed = user.Followers.some(fr => fr.id === helpers.getUser(req).id)
      res.status(302).json({
        followerCount: user.Followers.length,
        isFollowed
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: error.message
      })
    }
  },

  getUserTweets: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: Tweet,
          include: [{ model: Reply }, { model: User }, { model: Like }],
        },
        order: [[{ model: Tweet }, 'createdAt', 'DESC']],
        nest: true
      })
      const userTweets = user.toJSON().Tweets.map(tweet => ({
        ...tweet,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        isLiked: tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)
      }))
      userTweets.forEach(reply => {
        dateFormatter(reply, 8)
      })
      res.status(200).render('partials/tweet', { tweets: userTweets, layout: false })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }

  },

  getUserReplies: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: Reply,
          include: [
            {
              model: Tweet,
              include: { model: User }
            },
            { model: User }
          ],
        },
        order: [[{ model: Reply }, 'createdAt', 'DESC']],
        nest: true
      })
      const userReplies = user.toJSON().Replies
      userReplies.forEach(reply => {
        dateFormatter(reply, 8)
      })
      res.status(200).render('partials/tweet-reply', { replies: userReplies, layout: false })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })

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

      res.status(200).render('partials/tweet', { tweets: likedTweets, layout: false })
    } catch (error) {

      res.status(500).json({
        error: error.message
      })
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
        nest: true
      })
      if (!user) throw new Error('User not found')
      const followers = user.toJSON().Followers

      followers.forEach(follower =>
        follower.isFollowed = follower.Followers.some(fr => fr.id === helpers.getUser(req).id)
      )

      followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

      res.status(200).render('partials/user-followship', { users: followers, layout: false })
    } catch (error) {

      res.status(500).json({
        error: error.message
      })
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: User,
          as: 'Followings',
          include: { model: User, as: 'Followers' }
        },
        nest: true
      })

      if (!user) throw new Error('User not found')

      const followings = user.toJSON().Followings
      followings.forEach(following =>
        following.isFollowed = following.Followers.some(fr => fr.id === helpers.getUser(req).id)
      )
      followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

      res.status(200).render('partials/user-followship', { users: followings, layout: false })
    } catch (error) {

      res.status(500).json({
        error: error.message
      })
    }
  },
  editUserPage: async (req, res, next) => {
    try {
      const check = helpers.getUser(req).id === Number(req.params.id) ? true : false
      if (!check) return res.json({
        status: 'error',
        message: 'Permission denied!'
      })
      // 根據傳入的id找到對應的使用者
      const user = await User.findOne({ where: { id: req.params.id } })
      // console.log(user)
      if (!user) throw new Error('No such User!')
      // 回傳資料
      return res.json({
        status: 'success',
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        coverage: user.coverage,
        introduction: user.introduction
      })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const check = helpers.getUser(req).id === Number(req.params.id) ? true : false
      if (!check) return res.json({
        status: 'error',
        message: 'Permission denied!'
      })
      const { name, introduction, croppedAvatar, croppedCoverage } = req.body
      if (!name) throw new Error('Name is required!')
      // console.log(name, introduction)
      // Upload image to imgur
      const [user, avatarFilePath, coverageFilePath] = await Promise.all([
        User.findByPk(req.params.id),
        imgurFileHandler(croppedAvatar),
        imgurFileHandler(croppedCoverage)]
      )
      // console.log(avatarFilePath)
      // console.log(coverageFilePath)
      if (!user) throw new Error('Can not find user!')
      const updatedUser = await user.update({
        name,
        introduction,
        avatar: avatarFilePath || user.avatar,
        coverage: coverageFilePath || user.coverage
      })
      return res.json({
        status: 'success',
        id: updatedUser.id,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        coverage: updatedUser.coverage,
        introduction: updatedUser.introduction
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
