const userController = {
  registerPage: (req, res) => {
    return res.render('register')
  },
  loginPage: (req, res) => {
    return res.render('login')
  }
}

module.exports = userController