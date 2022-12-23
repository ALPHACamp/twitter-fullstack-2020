const { Op } = require("sequelize")
const helpers = require('./_helpers')
const db = require('./models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
module.exports = {
  getTopUsers: async (req) => {
    const user = helpers.getUser(req)
    const followingList = user && user.Followings.map(following => following.id)
    const allUsers = await User.findAll({
      where: { 
        role: 'user',
        id: { [Op.not]: Number(helpers.getUser(req).id) }
      },
      include: [{ model: User, as: 'Followers' }],
      nest: true
    })
    const topFollowings = allUsers
      .sort((a, b) => {
        b.Followers.length - a.Followers.length
      })
      .slice(0, 10)
      .map(topFollowing => {
        return {
          ...topFollowing.toJSON(),
          isFollowed: followingList.includes(topFollowing.id)
        }
      })
    return topFollowings  
  },
  getTweets: async (req) => {
    const user = helpers.getUser(req)
    const UserId = req.params.id || ''
    const tweets = await Tweet.findAll({
      where: UserId ? { UserId } : {},
      order: [['createdAt', 'DESC']],
      include: [User, Like, Reply],
      nest: true
    }) || []
    const data = tweets.map(t => ({
      ...t.dataValues,
      description: t.description.substring(0, 140),
      User: t.User.dataValues,
      user,
      isLiked: t.Likes.some(f => f.UserId === user.id)
    }))
    return data
  },
  getReplies: async (req) => {
    const TweetId = req.params.id || ''
    const replies = await Reply.findAll({
     where: { TweetId },
     order: [['createdAt', 'DESC']],
     include: [ User ],
     nest: true,
     raw: true
    }) || []
    return replies
  }
}