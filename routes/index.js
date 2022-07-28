const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const userController = require('../controllers/user-controller') 
const followshipController = require('../controllers/followship-controller')

router.get('/users/:id/setting', userController.getSetting)
router.get('/users', userController.getUsers)

router.post('/followships/:userId', authenticated, followshipController.addFollowing)
router.delete('/followships/:userId', authenticated, followshipController.removeFollowing)

router.use('/', (req, res) => res.render('users'))
router.use('/', generalErrorHandler)

module.exports = router
