const express = require('express')
const router = express.Router()

const adminController = require('../../controller/admin-controller')

router.get('/tweets', adminController.getTweets)

router.use('/', (req, res) => res.redirect('/admin/tweets'))

module.exports = router
