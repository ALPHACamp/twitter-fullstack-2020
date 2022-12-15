const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.signInPage)
router.post('/signin', adminController.signIn)
router.get('/logout', adminController.logout)

router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)
router.get('/users', adminController.getUsers)

router.get('/', (req, res) => res.redirect('/admin/signin'))

module.exports = router
