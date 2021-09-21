const db = require('../models')
const { Op } = require("sequelize");
const moment = require('moment')
const { Reply, User, Tweet, Like, Followship } = db

const profileController = {
  getPosts: async (req, res) => {
    try {
      const Profile = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
      })
      const followersCount = Profile.Followers.length
      const followingsCount = Profile.Followings.length

      const rawTweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [Reply,
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

      const tweetCount = Tweets.length

      const rawUsers = await User.findAll({
        include: [
          { model: User, as: 'Followers' },
        ],
        where: { id: { [Op.not]: req.params.id } }
      })
      const Users = await rawUsers.map(data => ({
        ...data.dataValues,
        FollowerCount: data.Followers.length,
      })).sort((a, b) => b.FollowerCount - a.FollowerCount)

      // Users = Users
      const TopUsers = Users.slice(0, 10)
      // return res.json({ Tweets, TopUsers, Profile, tweetCount, followersCount, followingsCount })
      return res.render("profile", { tweets: Tweets, users: TopUsers, profile: Profile, tweetCount, followersCount, followingsCount });
    } catch (error) {
      console.log(error)
    }
  },

}
module.exports = profileController