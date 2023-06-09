const { User, Tweet } = require('../models')

const adminController = {
  // 後台登入
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: async (req, res) => {
    req.flash('success_msg', '登入成功')
    return res.redirect('/admin/tweets')
  },
  // 後台頁面
  adminGetTweets: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        raw: true,
        nest: true,
        include: Tweet
      })
      return res.render('admin/tweets', { users })
    } catch (e) {
      next(e)
    }
  },
  deleteUserTweet: async (req, res, next) => {
    const { tid } = req.params
    try {
      const tweet = await Tweet.findByPk(tid)
      if (!tweet) throw new Error("This tweet didn't exist!")
      await tweet.destroy()
      return res.redirect('/admin/tweets')
    } catch (e) {
      next(e)
    }
  }
}
module.exports = adminController