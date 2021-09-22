const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const helpers = require('../_helpers')

const userService = {
  getPopular: async (req, res) => {
    try {
      const userself = req.user
      const users = await User.findAll({
        where: { role: 0 },
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      let popularUser = []
      popularUser = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))

      helpers.removeUser(popularUser, userself.id)
      popularUser = popularUser.sort(
        (a, b) => b.FollowerCount - a.FollowerCount
      )

      return popularUser
    } catch (err) {
      console.log(err)
    }
  },
  getProfileUser: async (req, res) => {
    try {
      const userId = req.params.userId
      let profileUser = await User.findOne({
        where: { id: userId, role: 0 },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, attributes: ['id'] }
        ]
      })
      profileUser.introduction =
        profileUser.introduction < 50
          ? profileUser.introduction
          : profileUser.introduction.substring(0, 50) + '...'
      profileUser.followerLength = profileUser.Followers.length
      profileUser.followingLength = profileUser.Followings.length
      profileUser.tweetLength = profileUser.Tweets.length
      
      return profileUser
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = userService
