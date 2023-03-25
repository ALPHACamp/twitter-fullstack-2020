const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

passport.use(new localStrategy(
  {
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:'true'
  },
  (req,email,password,done)=>{
    User.findOne({where:{email}})
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password,user.password)
          .then(res =>{
            if (!res) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return done(null,user)
          })
      })
  }
))

passport.serializeUser((user,done)=>{
  done(null,user.id)
})
passport.deserializeUser((userId,done)=>{
  User.findByPk(userId)
    .then(user => {
      user = user.toJSON()
      return done(null,user)
    })
})

module.exports = passport