const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  settingPage: (req, res) => {
    res.render('setting')
  }
}

module.exports = userController
