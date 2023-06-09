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
  getAdminTweets: async (req, res, next) => {
    const users = await User.findAll({
      where: { role: 'user' },
      raw: true,
      nest: true,
      include: Tweet
    })
    // console.log(users)
    return res.render('admin/tweets', { users })
  }
}
module.exports = adminController