const adminController = {
  signInPage: (req, res) => { // 後台登入
    res.render('admin/signin')
  },
  getTweets: (req, res) => { // 後台取得推文清單
    res.render('admin/tweets')
  },
  getUsers: (req, res) => { // 後台取得使用者列表
    res.render('admin/users')
  },
  logout: (req, res) => { // 後台登出
    res.redirect('signin')
  }
}

module.exports = adminController