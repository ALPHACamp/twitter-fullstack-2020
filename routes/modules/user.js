const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:userid/setting', userController.getSetting)
router.put('/:userid/setting', userController.putSetting)
router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
