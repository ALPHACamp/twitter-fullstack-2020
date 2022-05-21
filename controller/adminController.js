const { Tweet, User, Like, Reply } = require('../models')
const sequelize = require('sequelize')

const adminController = {
  signinPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC']]
      })
      const tweet = tweets.map(r => ({
        ...r,
        description:
          r.description.length > 50
            ? `${r.description.substring(0, 50)}...`
            : r.description
      }))
      return res.render('admin/tweets', { status: 200, tweet, page: 'tweets' })
    } catch (e) {
      res.status(302)
      return res.redirect('back')
    }
  },
  deleteTweets: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      await Tweet.destroy({ where: { id: Number(tweetId) } })
      await Like.destroy({ where: { TweetId: Number(tweetId) } })
      await Reply.destroy({ where: { TweetId: Number(tweetId) } })
      req.flash('success_messages', '刪除成功！')
      return res.redirect('/admin/tweets')
    } catch (e) {
      next(e)
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: [
          'name',
          'role',
          'account',
          'cover',
          'avatar',
          [
            sequelize.literal(
              '(select count(Tweets.UserId) from Tweets inner join Likes on Tweets.id = Likes.TweetId where Tweets.UserId = User.id)'
            ),
            'likeCount'
          ]
        ],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          Tweet
        ]
      })
      const data = users.map(r => ({
        ...r.dataValues,
        followerCount: r.Followers.length,
        followingCount: r.Followings.length,
        tweetCount: r.Tweets.length
      }))
      const newData = data.filter(a => a.role !== 'admin')
      const user = newData.sort((a, b) => b.tweetCount - a.tweetCount)
      return res.render('admin/users', { status: 200, user, page: 'users' })
    } catch (e) {
      res.status(302)
      return res.redirect('back')
    }
  }
}
module.exports = adminController
