const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.get('', (req, res) => {
  res.redirect('/admin/tweets')
})

module.exports = router
