const userController = {
  registerPage: (req, res) => {
    return res.render('register')
  },

  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('login')
  }
}

module.exports = userController