const { User } = require('../../models')

const userConroller = {
  getSignin: (req, res) => {
    res.render('signin')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  }
}

module.exports = userConroller
