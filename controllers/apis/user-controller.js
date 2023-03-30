const { sequelize, User, Tweet, Reply, Followship, Like } = require('../../models')
const helpers = require('../../_helpers')
const userServices = require('../../services/user-services')
const dateFormatter = require('../../helpers/dateFormatter')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const userController = {


  addFollowing: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id)
      const followship = await Followship.findOne({
        where: { followerId: helpers.getUser(req).id, followingId: req.params.id }
      })
      if (!user) throw new Error("User doesn't exist!")
      if (!followship) {
        await Followship.create({ followerId: helpers.getUser(req).id, followingId: req.params.id })
      }
      user = await User.findByPk(req.params.id, {
        include: {
          model: User,
          as: 'Followers'
        }
      })

      const isFollowed = user.Followers.some(fr => fr.id === helpers.getUser(req).id)
      res.status(200).json({
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
      res.status(200).json({
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
          include: [{ model: Reply }, { model: User }, { model: User, as: 'LikedUsers' }],
        },
        order: [[{ model: Tweet }, 'createdAt', 'DESC']],
        nest: true
      })
      const userTweets = user.toJSON().Tweets.map(tweet => ({
        ...tweet,
        replyCount: tweet.Replies.length,
        likeCount: tweet.LikedUsers.length,
        isLiked: tweet.LikedUsers.some(lu => lu.id === helpers.getUser(req).id)
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
      const user = await User.findByPk(req.params.id, {
        include: {
          model: Tweet,
          as: 'LikedTweets',
          include: [{ model: Reply }, { model: User }, { model: User, as: 'LikedUsers' }],
        },
                nest: true
      })
      const likedTweets = user.toJSON().LikedTweets.map(tweet => ({
        ...tweet,
        replyCount: tweet.Replies.length,
        likeCount: tweet.LikedUsers.length,
        isLiked: tweet.LikedUsers.some(lu => lu.id === helpers.getUser(req).id)
      }))
      likedTweets.sort((a, b) => b.Like.createdAt - a.Like.createdAt)
      likedTweets.forEach(reply => {
        dateFormatter(reply, 8)
      })

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
      // 根據傳入的id找到對應的使用者
      const user = await User.findOne({ where: { id: req.params.id } })
      if (!user) throw new Error('No such User!')
      // 回傳資料
      return res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            coverage: user.coverage,
            introduction: user.introduction
          }
        }
      })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const { name, introduction, croppedAvatar, croppedCoverage } = req.body
      if (!name) throw new Error('Name is required!')
      // console.log(name, introduction)
      // Upload image to imgur
      const [user, avatarFilePath, coverageFilePath] = await Promise.all([
        User.findByPk(req.params.id),
        imgurFileHandler(croppedAvatar),
        imgurFileHandler(croppedCoverage)]
      )
      console.log(avatarFilePath)
      console.log(coverageFilePath)
      if (!user) throw new Error('Can not find user!')
      const updatedUser = await user.update({
        name,
        introduction,
        avatar: avatarFilePath || user.avatar,
        coverage: coverageFilePath || user.coverage
      })
      return res.json({
        status: 'success',
        data: {
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            avatar: updatedUser.avatar,
            coverage: updatedUser.coverage,
            introduction: updatedUser.introduction
          }
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
