const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.put('/:userid/setting', userController.putSetting)
router.get('/:userid/setting', userController.getSetting)
router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
