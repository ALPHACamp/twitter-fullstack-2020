const express = require('express')
const router = express.Router()
const userController = require('../controller/user-controller')


//signin
router.get('/signin', userController.signInPage)

//fallback
router.get('/', (req, res) => { res.redirect('/signin') })

module.exports = router