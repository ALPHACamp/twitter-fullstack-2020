const bcrypt = require('bcryptjs') 
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if(req.body.passwordCheck !== req.body.password){
      req.flash('error_messages', 'differenct passwords！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({where: {account: req.body.account}}).then(user => {
        if(user){
          req.flash('error_messages', 'same account')
          return res.redirect('/signup')
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', 'registered successfully')
            return res.redirect('/signin')
          })  
        }
      })    
    }
  }
}

module.exports = userController