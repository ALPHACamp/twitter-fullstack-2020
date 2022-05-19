const { Tweet, User, Reply, Like } = require('../models')
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
      res.render('admin/tweets', { user, tweets: data })
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
  // getUsers: async (req, res, next) => {
  //   try {
  //     const user = await Promise.all([
  //       User.findAll({
  //         order: [['createdAt', 'DESC']],
  //         attributes: ['id', 'name', 'account', 'avatar', 'cover'],
  //         include: [
  //           { model: User, as: 'Followers', attributes: ['id'] }, // 提供給 Followers 的數量計算
  //           { model: User, as: 'Followings', attributes: ['id'] }, // 提供給 Followings 的數量計算
  //           // { model: User, as: 'LikedUsers' },
  //           // { model: Tweet, attributes: ['id'] } // 提供給 tweets 的數量計算
  //         ]
  //       })
  //     ])
  //     return res.render('admin/users', { users: user })
  //   } catch (err) {
  //     next(err)
  //   }
  // }
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      nest: true,
      include: [
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] }
      ]
    })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  }

}
module.exports = adminController
