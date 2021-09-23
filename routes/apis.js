const express = require('express')
const router = express.Router()
const auth = require('../config/auth')
const userController = require('../controllers/api/userController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/admin/restaurants')

// edit api/users
router.get('users/:id/', auth.authenticatedGeneral, userController.getUser)
router.post(
  '/users/:id',
  auth.authenticatedGeneral,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  userController.putUser
)

module.exports = router
