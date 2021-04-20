let userController = {
  signInPage: (req, res) => {
    return res.render('login')
  },
  signUpPage: (req, res) => {
    return res.render('register')
  },
}

module.exports = userController