const express = require('express')
const router = express.Router()
const userController = require('../../controllers/pages/user-controller')

router.get('/signin', userController.getSignin)
router.get('/', (req, res) => res.send('Hello World!'))

module.exports = router
