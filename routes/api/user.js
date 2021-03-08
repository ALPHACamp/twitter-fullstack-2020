const express = require('express')
const router = express.Router()
const helpers = require('../../_helpers')
const userauthenticated = require('../../middleware/auth').userauthenticated
const userController = require('../../controllers/userController')
router.use(userauthenticated)
router.get('/:id', (req, res, next) => {
  if (helpers.getUser(req).id !== Number(req.params.id)) {
    return res.json({ status: 'error', message: 'something error' })
  }
  return next()
}, userController.getUserData)
router.post('/:id', userController.apiEditUser)


module.exports = router