const express = require('express')
const tweetController = require('../controllers/tweetController')
const router = express.Router()

router.get('/', (req, res) => { res.redirect('/home') })
router.get('/home', tweetController.getTweets)


module.exports = router
