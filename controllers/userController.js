const { sequelize } = require('../models')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const userController = {
  getUser: async (req, res) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Tweet.findAll({
        // raw: true,
        // nest: true,
        where: { UserId: req.params.id },
        include: [User, Reply, { model: Like, include: [User] }],
        order: [['createdAt', 'DESC']],
      }),
      User.findAll({
        // raw: true,
        // nest: true,
        include: [{ model: User, as: 'Followers' }]
      })
    ]).then(([user, tweets, followings]) => {
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        countLikes: tweet.Likes.length,
        countReplies: tweet.Replies.length,
        User: tweet.User.dataValues,
        isLike: tweet.Likes.map(d => d.UserId).includes(Number(req.params.id)),
      }))
      // console.log(tweets)

      followings = followings.map(user => ({
        ...user.dataValues,
        isFollowed: user.Followers.map(d => d.id).includes(Number(req.params.id))
      }))
      followings = followings.filter(user => user.role !== "admin")
      followings = followings.filter(user => user.id !== Number(req.params.id))
      console.log(followings)

      return res.render('profile', {
        user: user.toJSON(),
        FollowersLength: user.dataValues.Followers.length,
        FollowingsLength: user.dataValues.Followings.length,
        tweetsLength: tweets.length,
        data: tweets,
        followings: followings
      })
    })
  }
}

module.exports = userController