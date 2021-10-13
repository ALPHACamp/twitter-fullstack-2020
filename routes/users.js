const router = require('express').Router()
const usersController = require('../controllers/usersController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/:id', usersController.getUser)

router.get('/:id/tweets', usersController.getUserTweets)

router.get('/:id/replies', usersController.getUserReplies)

router.get('/:id/likes', usersController.getUserLikes)

router.get('/:id/likes', usersController.getUserLikes)

router.put('/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), usersController.editUserData)

module.exports = router