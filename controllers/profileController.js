const db = require('../models')
const moment = require('moment')
const { Reply, User, Tweet, Like, Followship } = db

const profileController = {
  getPosts: async (req, res) => {
    try {
      console.log(req.params.id)
      const rawTweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [Reply, User,
          { model: User, as: 'LikedUsers' }],
        order: [['createdAt', 'DESC']],
        limit: 20
      })
      const Tweets = await rawTweets.map(data => ({
        ...data.dataValues,
        ReplyCount: data.Replies.length,
        LikedCount: data.LikedUsers.length,
        Replies: data.Replies.sort((a, b) => b.createdAt - a.createdAt),
        LikedUsers: data.LikedUsers.sort((a, b) => b.Like.createdAt - a.Like.createdAt),
        createdAt: moment(data.createdAt).fromNow()
      }))
      const rawUsers = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ],
      })
      let Users = await rawUsers.map(data => ({
        ...data.dataValues,
        FollowerCount: data.Followers.length,
      }))
      Users = Users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      const TopUsers = Users.slice(0, 10)
      return res.json({ Tweets, TopUsers })
      return res.render("profile", { tweets: Tweets, users: TopUsers });
    } catch (error) {
      console.log(error)
    }
  },

}
module.exports = profileController