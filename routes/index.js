const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middleware/error-handler')

const admin = require('./modules/admin')

const adminController = require('../controllers/admin-controller')

const passport = require('../config/passport')

router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)

router.use('/admin', admin)

router.get('/', (req, res) => res.render('index'))

router.use('/', generalErrorHandler)

module.exports = router