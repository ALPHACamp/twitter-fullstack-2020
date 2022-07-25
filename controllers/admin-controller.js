// admin頁面各種 signin/ getuser/ gettweet/ deletetweet/ logout

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('admin/tweets')
  },
  getAdminTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  getAdminUsers: (req, res) => {
    return res.render('admin/users')
  }
}

module.exports = adminController
