const db = require('../models')
const { sequelize } = db
const { Op } = db.Sequelize
const { User, Tweet, Reply, Like, Followship } = db

const adminController = {
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [{ model: User }],
      })

      tweets = tweets.map((tweet) => ({
        ...tweet,
        description: tweet.description.slice(0, 50),
      }))

      return res.render('admin', { tweets, partial: 'adminTweets' })
    } catch (err) {
      console.error(err)
    }
  },

  deleteTweet: async (req, res) => {
    try {
      await Tweet.destroy({ where: { id: req.params.tweetId } })
      return res.redirect('/admin/tweets')
    } catch (err) {
      console.error(err)
    }
  },

  adminUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [
          { model: Tweet, include: [Like] },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
        ],
        order: [[Tweet, 'createdAt', 'ASC']],
      })

      users = users
        .map((user) => ({
          ...user.dataValues,
          tweetCount: user.Tweets.length,
          likeCount: adminController.sumLikes(
            user.Tweets.map((tweet) => tweet.Likes.length)
          ), // 有寫工具function adminController.sumLikes(arr) 計算加總
          followingCount: user.Followings.length,
          followerCount: user.Followers.length,
        }))
        .sort((a, b) => b.tweetCount - a.tweetCount) // 根據tweet數排序

      return res.render('admin', { users, partial: 'adminUsers' })
      // return res.json(users)
    } catch (err) {
      console.error(err)
    }
  },

  sumLikes: (arr) => {
    let likes = 0
    arr.forEach((i) => (likes += i))
    return likes
  },
}

module.exports = adminController
