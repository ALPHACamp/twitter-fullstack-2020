const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

router.get('/users/:id/tweets', userController.getUserTweets)

router.get('/', (req, res) => res.render('index'))

module.exports = router
