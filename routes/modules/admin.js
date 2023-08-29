const express = require('express')

const adminController = require('../../controllers/pages/admin-controller')

// passport & auth
const { adminLocalAuth, authenticatedAdmin } = require('../../middlewares/auth')

const router = express.Router()

// Tweets page
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweets)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)

// Users page
router.get('/users', authenticatedAdmin, adminController.getUsers)

// Signin
router.get('/signin', adminController.getAdminSignInPage)
router.get('/logout', adminController.adminLogout)
router.post('/signin', adminLocalAuth, adminController.adminSignin)

router.get('/', adminLocalAuth, (req, res) => {
  res.redirect('/admin/tweets')
})

module.exports = router
