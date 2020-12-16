const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController.js')
const userController  = require('../controllers/userController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helplers = require('../_helpers')
// const { authenticated, authenticatedAdmin, isOwnProfile, editOwnProfile } = require('../middleware/check-auth')

const passport = require('../config/passport')

router.get('/', userController.signInPage)
router.get('/signin', userController.signInPage)

module.exports = router