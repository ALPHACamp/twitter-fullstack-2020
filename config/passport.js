const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

passport.use(new LocalStrategy(
	{
		usernameField: 'account',
		passwordField: 'password',
		passReqToCallback: true
	},
	(req, account, password, cb) => {
		User.findOne({ where: { account } })
			.then(user => {
				if (!user) return cb(null, false, req.flash('error_messages', '帳號不存在'))
				bcrypt.compare(password, user.password).then(res => {
					if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
					return cb(null, user)
				})
			})
	}
))

passport.serializeUser((user, cb) => {
	cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
	User.findByPk(id).then(user => {
		user = user.toJSON()
		console.log(user)
		return cb(null, user)
	})
})
module.exports = passport
