const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const userController = {
	signUpPage: (req, res) => {
		res.render('signup')
	},
	signUp: (req, res, next) => {
		const { account, name, email, password, checkPassword } = req.body
		if (!account || !name || !email || !password || !checkPassword) {
			req.flash('error_messages', '所有內容都需要填寫')
			return res.redirect('/signup')
		} 
		if (password !== checkPassword) {
			req.flash('error_messages', '密碼與密碼確認不相符')
			return res.redirect('/signup')
		} 
		if (!email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/)) {
			req.flash('error_messages', 'email 輸入錯誤')
			return res.redirect('/signup')
		} 
		if (name.length > 50 || account.length > 50) {
			req.flash('error_messages', '字數超出上限！')
			return res.redirect('/signup')
		}

		Promise.all([
			User.findOne({ where: { email } }),
			User.findOne({ where: { account } })
		])
			.then(([userEmail, userAccount]) => {
				if (userEmail) {
					req.flash('error_messages', 'email 已重複註冊！')
					return res.redirect('/signup')
				} else if (userAccount) {
					req.flash('error_messages', 'account 已重複註冊！')
					return res.redirect('/signup')
				} else {
					User.create({
						role: "user",
						account: account,
						name: name,
						email: email,
						password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
					})
					.then(() => {
						req.flash('success_messages', '成功註冊帳號！')
						return res.redirect('/signin')
					})
					.catch(err => next(err))
		}})
	},
	signInPage: (req, res) => {
		res.render('signin')
	},
	signIn: (req, res) => {
		req.flash('success_messages', '成功登入！')
		res.redirect('/tweets')
	},
	logout: (req, res) => {
		req.flash('success_messages', '登出成功！')
		req.logout()
		res.redirect('/signin')
	},
}

module.exports = userController