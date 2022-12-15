const helpers = require('../_helpers');

const authenticated = (req, res, next) => {
	if (helpers.ensureAuthenticated(req)) {
		if (helpers.getUser(req).role === 'admin') {
			req.flash('error_messages', '管理者無法使用前台頁面')
			return res.redirect('/signin')
		} else { 
			return next() 
		} 
	} else{
		return res.redirect('/signin')
	}
}

const authenticatedAdmin = (req, res, next) => {
		if (helpers.getUser(req).role === 'admin') {
			return next()
		} else { 
			req.flash('error_messages', '無法使用後台頁面')
			return res.redirect('/admin/signin')
		}
	}

const authenticatedUser = (req, res, next) => {
	const id = req.params.id
	if (helpers.ensureAuthenticated(req)) {
		if (helpers.getUser(req).id === Number(id)) return next()
		res.redirect(`/users/${id}`)
	} else {
		res.redirect('/signin')
	}
}
module.exports = {
	authenticated,
	authenticatedAdmin,
	authenticatedUser
}