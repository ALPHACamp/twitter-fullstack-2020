const db = require('../models')
const User = db.User

const userController = {
  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res, next) => {
    
    req.flash('success_msg', '成功登入！')
    User.findAll().then(user => {
      console.log(req.body)
      //console.log(user)
    })
    return res.redirect('/tweets')
  }
}

module.exports = userController