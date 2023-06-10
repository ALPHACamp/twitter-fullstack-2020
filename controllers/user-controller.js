const userController = {
  signinPage: (req, res) => {
    res.render('signin')
  },
  signupPage: (req, res) => {
    res.render('signup')
  },
  signin: (req, res, next) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/tweets')
  },
  signup: (req, res, next) => {
    req.flash('success_messages', '註冊成功，請登入!')
    res.redirect('/signin')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
