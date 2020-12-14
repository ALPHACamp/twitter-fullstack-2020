const passport = require('passport')
const user = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ where: { email: email } }).then(user => {
        if (!user) {
            return done(null, false, req.flash('error_msg', 'That email is not registered!'))
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, req.flash('error_msg', 'Email or password incorrect!'))
        }
        return done(null, user)
    }).catch(err => done(err, false))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findByPk(id, {
            include: [
                {model: User, as: 'Followers'},
                {model: User, as: 'Followings'}
            ]
        }).then(user => {
            done(null, user.toJSON())
        })
    })
}
))

module.exports = passport