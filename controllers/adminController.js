const db = require('../models')
const { Reply, User, Tweet, Like, Followship } = db

const adminController = {
  getPosts: (req, res) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        description: t.description.substring(0, 50),
      }))
      return res.json(data)
    })
  },
  deletePost: (req, res) => {
    return Tweet.findByPk(req.params.id).then((tweet) => {
      tweet.destroy().then(() => {
        return res.json({ status: 'success', tweet })
      })
    })
  },
  getUsers: (req, res) => {
    return User.findAll({
      include: [
        Reply, Tweet, Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(users => {
      const data = users.map(data => ({
        ...data.dataValues,
        TweetCount: data.Tweets.length,
        ReplyCount: data.Replies.length,
        LikedCount: data.Likes.length,
        FollowersCount: data.Followers.length,
        FollowingsCount: data.Followings.length
      }))
      data.sort((a, b) => b.TweetCount - a.TweetCount)
      return res.json(data)
    })
  }
}

module.exports = adminController