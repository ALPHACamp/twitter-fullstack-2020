let userController = {
  signInPage: (req, res) => {
    return res.render('login')
  },
  signUpPage: (req, res) => {
    return res.render('register')
  },
  settingPage: (req, res) => {
    return res.render('setting')
  }
}

module.exports = userController