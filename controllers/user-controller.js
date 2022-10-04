const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  getSetting: (req, res) => {
    res.render('setting')
  },
  getUser: (req, res) => {
    res.render('user')
  },
  getReply: (req, res) => {
    res.render('modals/reply')
  }
}

module.exports = userController
