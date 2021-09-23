const db = require('../models')
const { Reply, User, Tweet, Like, Followship } = db

const adminController = {
  getPosts: (req, res) => {
    return Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        description: t.description.substring(0, 50),
      }))
      // return res.json(data)
      return res.render('admin/tweets', { tweet: data })
    })
      .catch((error) => res.status(400).json(error));
  },

  deletePost: (req, res) => {
    return Tweet.findByPk(req.params.id).then((tweet) => {
      tweet.destroy().then(() => {
        // return res.json({ status: 'success', tweet })
        return res.redirect('/admin/tweets')
      })
    })
      .catch((error) => res.status(400).json(error));
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
      // return res.json(data)
      return res.render('admin/users', { user: data })
    })
      .catch((error) => res.status(400).json(error));
  }
}

module.exports = adminController