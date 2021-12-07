const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()

const userController = require('../controllers/api/userController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  return res.json({ status: 'error', message: '你無權查看此頁面' })
}

router.get('/users/:userId', authenticated, userController.getEditModal)
router.post('/users/:userId', authenticated, userController.updateUser)

module.exports = router
