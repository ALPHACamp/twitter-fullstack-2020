const db = require('../models')
const Tweet = db.Tweet

const adminController = {
	getTweets: (req, res) => {
		Tweet.findAll({
			raw: true
		})
		.then(tweets =>{
			return res.render('admin/tweets',{tweets})
		})
	},
	signInPage: (req, res) => {
		res.render('admin/signin')
	},
	signIn: (req, res) => {
		req.flash('success_messages', 'admin 成功登入！')
		res.redirect('/admin/tweets')
	},
	logout: (req, res) => {
		req.flash('success_messages', '登出成功！')
		req.logout()
		res.redirect('/admin/signin')
	},
}
module.exports = adminController
