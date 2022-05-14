const { User, Tweet, Reply, Like, Followship } = require('../models')

const userController = {
  getUser: (req, res, next) => {
    const { type } = req.query
    let tweetsSelect, relpiesSelect, likesSelect

    if (type === 'relpies') {
      relpiesSelect = true
    } else if (type === 'likes') {
      likesSelect = true
    } else {
      tweetsSelect = true
    }

    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet, include: [Reply, Like] },
          { model: Reply, include: { model: Tweet, include: [User] } },
          { model: Like, include: { model: Tweet, include: [User, Reply, Like] } },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [
          [Tweet, 'createdAt', 'DESC'],
          [Reply, 'createdAt', 'DESC'],
          [Like, 'createdAt', 'DESC']
        ]
      }),
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([user, users]) => {
        const LIMIT = 10

        user = {
          ...user.toJSON(),
          followerCount: user.Followers.length,
          followingCount: user.Followings.length
        }

        const result = users
          .map(item => ({
            ...item.toJSON(),
            followerCount: item.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === item.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, LIMIT)

        res.render('user', { user, users: result, tweetsSelect, relpiesSelect, likesSelect })
      })
  },
  getUserFollowship: (req, res, next) => {
    const { type } = req.query
    let followersSelect, followingsSelect

    if (type === 'followers') {
      followersSelect = true
    } else {
      followingsSelect = true
    }

    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet, include: [Reply, Like] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [
          ['Followers', Followship, 'createdAt', 'DESC'],
          ['Followings', Followship, 'createdAt', 'DESC']
        ]
      }),
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([user, users]) => {
        const LIMIT = 10
        const useData = user.toJSON()

        user = {
          ...useData,
          Followers: useData.Followers.map(follower => ({
            ...follower,
            isFollowersFollowed: req.user.Followings.some(f => f.id === follower.Followship.followerId)
          })),
          Followings: useData.Followings.map(following => ({
            ...following,
            isFollowingsFollowed: req.user.Followings.some(f => f.id === following.Followship.followingId)
          }))
        }

        const result = users
          .map(item => ({
            ...item.toJSON(),
            followerCount: item.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === item.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, LIMIT)

        res.render('followship', { user, users: result, followersSelect, followingsSelect })
      })
  }
}

module.exports = userController
