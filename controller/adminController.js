const { Tweet, User, Like, Reply } = require('../models')

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
      return res.render('admin/tweets', { status: 200, tweet })
    } catch (e) {
      console.log('e')
      res.status(302)
      return res.redirect('back')
    }
  },
  deleteTweets: (req, res) => {
    const tweetId = req.params.id
    Tweet.findOne({ where: { id: Number(tweetId) } })
      .then(tweet => {
        return tweet.destroy()
      })
      .then(() => {
        res.status(200)
        req.flash('success_messages', '刪除成功！')
        res.redirect('back')
      })
      .catch(e => {
        console.log('e')
        res.status(302)
        return res.redirect('back')
      })
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['name', 'role', 'account', 'avatar', 'cover'],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, as: 'LikedTweets' },
          Tweet
        ]
      })
      const data = users.map(r => ({
        ...r.dataValues,
        followerCount: r.Followers.length,
        followingCount: r.Followings.length,
        tweetCount: r.Tweets.length,
        likedCount: r.LikedTweets.length
      }))
      const newData = data.filter(a => a.role !== 'admin')
      const user = newData.sort((a, b) => b.tweetCount - a.tweetCount)
      return res.render('admin/users', { status: 200, user })
    } catch (e) {
      console.log('e')
      res.status(302)
      return res.redirect('back')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signIn')
  }
}
module.exports = adminController
