const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const userController = require('../../controllers/api/userController')
const tweetController = require('../../controllers/api/tweetController')

router.get('/tweets/:tweetId/replies', authenticated, tweetController.getModalTweet)

router.get('/users/:userId', authenticated, userController.getUser)
router.post('/users/:userId',authenticated,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  userController.editUser
)

module.exports = router
