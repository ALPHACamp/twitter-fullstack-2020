const userController = {
  signUpPage: (req, res) => {
      return res.render('signup')
  },
  signInPage: (req, res) => {
    return res.render('signin')
  }
}

module.exports = userController