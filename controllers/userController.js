

const userController = {

  getSigninPage: (req, res) => {
    return res.render('signin')
  },

  signin: (req, res) => {
    return res.redirect('/tweets')
  },



}

module.exports = userController