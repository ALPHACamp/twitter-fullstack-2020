const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')

const followshipController = require('../../controllers/followshipController')

//add follow 與 delete follow傳入值的方法不同
router.post('/', authenticated, followshipController.addFollowing) 
router.delete('/:userId',authenticated,followshipController.removeFollowing)


module.exports = router
