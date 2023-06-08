const { User, Tweet } = require('../models')
const Sequelize = require('sequelize')

// 未完成
const adminController = {
  getTweets: (req, res, next) => {
    res.render('admin/admin-tweets')
  },

  // 未完成
  getUsers: (req, res, next) => {
    // render 頁面的參數：
    // tweetCount 每個 user 的推文總數
    // likeCount 每個 user 被按讚總數
    // followingCount 每個 user 追蹤者總數
    // followerCount 每個 user 追隨者總數

    return User.findAll({
      raw: true,
      nest: true,
      include: [
        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.user_id = User.id)'), 'likeCount'],
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ],
      where: { is_admin: false }
    })
      .then(users => {
        const result = users.map(user => ({
          ...user,
          followerCount: user.Followers.length,
          followingCount: user.Followings.length,
          likeCount: user.likeCount
        }))
        const likeCount = result.reduce((sum, user) => sum + user.likeCount, 0)
        res.render('admin/admin-users', {
          users,
          likeCount,
          followerCount: result.followerCount,
          followingCount: result.followingCount
        })
      })
      .catch(err => next(err))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('admin/tweets'))
      .catch(err => next(err))
  }
}

module.exports = adminController
