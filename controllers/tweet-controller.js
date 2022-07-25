const assert = require('assert')
const helpers = require("../_helpers")
const { User, Tweet } = require('../models')
const tweetcontroller = {
  getTweets: (req, res) => {
    return res.render('tweets')
  },
  getUser: (req, res, next) => {
    const currentUser = getUser(req)
    Promise.all([User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      order: [
        [{ model: Comment }, 'createdAt', 'DESC']
      ]
    }),
    Comment.findAndCountAll({
      where: { userId: req.params.id }
    }),
    Comment.findAll({
      include: Restaurant,
      where: { userId: req.params.id },
      group: ['restaurant_id'],
      nest: true,
      raw: true
    })
    ])
      .then(([targetUser, totalComments, commentedRestaurants]) => {
        if (!targetUser) throw new Error("User doesn't exist!")
        const isFollowed = req.user.Followings.some(f => f.id === targetUser.id)
        res.render('users/profile', {
          targetUser: targetUser.toJSON(), // 查看其他使用者
          user: currentUser, // 現在登入的使用者
          totalComments,
          commentedRestaurants,
          isFollowed
        })
      })
      .catch(err => next(err))
  },
  getTweets: async (req, res, next) => {
    try {
      const user = helpers.getUser(req.user)
      const tweets = await Tweet.findAll({
        include: User,
        order: [
          ['created_at', 'DESC']
        ],
        raw: true,
        nest: true
      })
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
      const userId = helpers.getUser(req.user).id
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
  }
}

module.exports = tweetController
