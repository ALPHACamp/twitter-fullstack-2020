const { Tweet, User } = require('../models')
const helper = require('../_helpers')

const adminController = {
  signInPage: async (req, res, next) => {
    try {
      res.render('admin/signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      res.redirect('/admin/tweets')
    } catch (err) {
      next(err)
    }
  },
  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '登出成功！')
      req.logout()
      res.redirect('/admin/signin')
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const userId = helper.getUser(req).id
      const [user, tweets] = await Promise.all([
        User.findByPk(userId,
          {
            attributes: ['id', 'name', 'avatar'],
            raw: true
          }),
        Tweet.findAll({
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'description', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ]
        })
      ])
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        // 快覽 Tweet 的前 50 個字
        description: tweet.description.substring(0, 50)
      }))
      res.render('admin/tweets', { user, tweets: data, adminMenu: 'tweets' })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: (req, res, next) => {
    try {
      Tweet.findByPk(req.params.id)
        .then(tweet => {
          if (!tweet) throw new Error("Tweet didn't exist!")
          return tweet.destroy()
        })
        .then(() => res.redirect('back'))
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'name', 'account', 'avatar', 'cover'],
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: Tweet, attributes: ['id'], include: [{ model: User, as: 'LikedUsers' }] }
        ]
      })

      const data = users.map(user => ({
        ...user.toJSON(),
        tweetCounts: user.Tweets.length,
        followingCounts: user.Followers.length,
        followerCounts: user.Followings.length,
        beenLikedTweets: user.Tweets.reduce((acc, obj) => {
          return acc + obj.LikedUsers.length
        }, 0)
      }))
        .sort((a, b) => b.tweetCounts - a.tweetCounts)
      res.render('admin/users', { users: data, adminMenu: 'users' })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = adminController
