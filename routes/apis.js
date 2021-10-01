const express = require('express')
const router = express.Router()
const auth = require('../config/auth')
const userController = require('../controllers/api/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

//user's profile
router.get('/users/:id', auth.authenticatedGeneral, userController.getUser)
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
