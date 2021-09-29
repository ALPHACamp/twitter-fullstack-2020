const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')
const userController = require('../controllers/api/userController.js')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role !== 'admin') {
      return next()
    }
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '管理者無法使用前台頁面')
      return res.redirect('/admin/tweets')
    }
  }
  req.flash('error_messages', '請先登入')
  res.redirect('/signin')
}


//render edit page (modal)
router.get('/users/:id', authenticated, userController.renderUserEdit)

//update edit page (modal)
router.post('/users/:id', authenticated, userController.putUserEdit)

module.exports = router