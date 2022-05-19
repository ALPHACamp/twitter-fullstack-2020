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
        ...tweet.toJSON()
        // ...tweet.dataValues,
        // description: tweet.dataValues.description.substring(0, 100)
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
  }

}
module.exports = adminController
