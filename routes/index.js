const express = require('express')
const router = express.Router()
const { userController } = require('../controllers/user-controller')
// const helpers = require('../_helpers')
router.get('/', (req, res) => {
  res.send('Hello World!')
})

// authenticated還沒載入 還沒寫這功能
router.post('/followships/:userId', authenticated, userController.addFollowing)
router.delete('/followships/:userId', authenticated, userController.deleteFollowing)

module.exports = router
