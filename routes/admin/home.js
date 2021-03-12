const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticatedAdmin = require('../../middleware/auth').authenticatedAdmin

const adminController = require('../../controllers/adminController')
//admin/login 
///admin router
router.get('/signin', adminController.signInPage)
///一直導錯
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin',
  failureFlash: true
}), authenticatedAdmin, (req, res) => {
  return res.redirect('/admin/tweets')
})
///

module.exports = router