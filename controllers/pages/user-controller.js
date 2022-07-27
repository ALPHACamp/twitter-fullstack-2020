const { User } = require('../../models')

const userConroller = {
  getSignin: (req, res) => {
    res.render('signin')
  }
}

module.exports = userConroller
