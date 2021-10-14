const router = require('express').Router()
const apiController = require('../controllers/apiController')
const helpers = require('../_helpers')

const checkRole = (req, res, next) => {
  if (helpers.getUser(req).role !== 'admin') {
    return next()
  }
  return res.redirect('/admin/tweets')
}

router.get('/users/:id', checkRole, apiController.getUserInfoEdit)

router.post('/users/:id', checkRole, apiController.postUserInfoEdit)

module.exports = router