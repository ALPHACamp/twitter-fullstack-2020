let userController = {
  loginPage: (req, res) => {
    return res.render('login')
  },
  registerPage: (req, res) => {
    return res.render('register')
  },
  settingPage: (req, res) => {
    return res.render('setting')
  }
}

module.exports = userController