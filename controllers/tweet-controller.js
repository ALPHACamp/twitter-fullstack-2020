const assert = require('assert')
const helpers = require("../_helpers")
const { User, Tweet, Like, Reply } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const tweetController = {
  // getTweets: (req, res, next) => {
  //   console.log('here is tweets.')
  //   const currentUser = getUser(req)
  //   res.render('tweets') //, { currentUser }
  //   Promise.all([User.findByPk(currentUser.id, {
  //     include: [
  //       // tweets
  //       { model: Comment, include: Restaurant },
  //       { model: Restaurant, as: 'FavoritedRestaurants' },
  //       { model: User, as: 'Followings' }
  //     ],
  //     order: [
  //       [{ model: Comment }, 'createdAt', 'DESC']
  //     ]
  //   }),
  //   Comment.findAndCountAll({
  //     where: { userId: req.params.id }
  //   }),
  //   Comment.findAll({
  //     include: Restaurant,
  //     where: { userId: req.params.id },
  //     group: ['restaurant_id'],
  //     nest: true,
  //     raw: true
  //   })
  //   ])
  //     .then(([targetUser, totalComments, commentedRestaurants]) => {
  //       if (!targetUser) throw new Error("User doesn't exist!")
  //       const isFollowed = req.user.Followings.some(f => f.id === targetUser.id)
  //       res.render('tweets', {
  //         targetUser: targetUser.toJSON(), // 查看其他使用者
  //         user: currentUser, // 現在登入的使用者
  //         totalComments,
  //         commentedRestaurants,
  //         isFollowed
  //       })
  //     })
  //     .catch(err => next(err))
  // },
  getTweets: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: [
          User,
          { model: User, as: 'LikedUsers' }
        ],
        order: [
          ['created_at', 'DESC']
        ],
        raw: true,
        nest: true
      })
      console.log('------------------------', tweets)
      return res.render('tweets', { tweets, user })
    }
    catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      assert(description.length <= 140, "請以 140 字以內為限")
      assert((description.trim() !== ''), "內容不可空白")
      const userId = helpers.getUser(req).id
      const createdTweet = await Tweet.create({
        userId,
        description
      })
      assert(createdTweet, "Failed to create tweet!")
      req.flash('success_messages', '發推成功！')
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id
      const newLike = await Like.findOrCreate({
        where: {
          userId,
          tweetId
        }
      })
      console.log(newLike)
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id
      const like = await Like.findOne({
        where: {
          userId,
          tweetId
        }
      })
      await like.destroy()
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
