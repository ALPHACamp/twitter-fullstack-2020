
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')
const Followship = db.Followship
const Tweet = db.Tweet
const Like = db.Like
const sequelize = require('sequelize')


const tweetController = {
  getTweet: async (req, res) => {
    console.log(req.user)
    //tweet data
    let tweets = await Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User]
    })
    tweets = tweets.map(t => ({
      ...t.dataValues,
      userName: t.User.name,
      userId: t.User.id,
      isLiked: helpers.getUser(req).Likes.map(d => d.TweetId).includes(t.id)
    }))
    //user data
    let users = await User.findAll({
      limit: 10,
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Followships AS Followship
              WHERE Followship.followingId = User.id
            )`),
            'FollowerCount'
          ]
        ]
      },
      order: [
        [sequelize.literal('FollowerCount'), 'DESC']
      ],
      where: {
        role: 'user'
      },
      include: [
        { model: User, as: 'Followers' } //找出每個User被追蹤的名單(user.Followers)
      ]
    })
    users = users.map(user => ({
      ...user.dataValues,
      isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
    }))
    return res.render('testFollow', { users, tweets })
  },
  addLike: async (req, res) => {
    await Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
    return res.redirect('back')
  },
  removeLike: async (req, res) => {
    const awaitRemove = await Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
    await awaitRemove.destroy()
    return res.redirect('back')
  }
}
module.exports = tweetController