const userController = {
  signinPage: (req, res) => {
    res.render('signin')
  },
  signin: (req, res, next) => {}
}

module.exports = userController
