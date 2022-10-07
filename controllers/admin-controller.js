const { User, Tweet, Like, Reply } = require('../models')
const { getUser } = require('../_helpers')
const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (getUser(req).role === 'user') {
      req.flash('error_messages', '請前往前台登入')
      res.redirect('/admin/signin')
    }
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [User],
      raw: true,
      nest: true,
      order: [['created_at', 'DESC']] // 反序
    }).then(tweets => {
      const result = tweets.map(tweet => {
        return {
          ...tweet,
          description: tweet.description.substring(0, 50)
        }
      })
      return res.render('admin/tweets', { tweets: result })
    })
      .catch(err => next(err))
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(req.params.id)
      await tweet.destroy()
      await Reply.destroy({ where: { tweetId } })
      await Like.destroy({ where: { tweetId } })

      req.flash('success_messages', '成功刪除')
      res.redirect('/admin/tweets')
    } catch (err) {
      next(err)
    }
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  }

}

module.exports = adminController
