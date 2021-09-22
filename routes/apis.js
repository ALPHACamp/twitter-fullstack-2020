const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/api/tweetController')
const authenticated = passport.authenticate('jwt', { session: false })

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const multipleUpload = upload.fields([{ name: 'avatar' }, { name: 'cover' }])


// const authenticatedAdmin = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     if (helpers.getUser(req).role === "admin") { return next() }
//     req.flash('error_messages', '請確認使用者身分')
//     return res.redirect('/admin/signin')
//   }
//   req.flash('error_messages', '請先登入')
//   res.redirect('/admin/signin')
// }

// router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
// router.post('/followships/:user_id', authenticated,  userController.addFollowing)

// //使用者新增一則貼文
router.post('/tweets', authenticated, tweetController.postTweets)

// //使用者顯示特定使用者頁面(使用者所有貼文)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)

//render edit page (modal)
router.get('/users/:id', authenticated, userController.renderUserEdit)

//update edit page (modal)
router.post('/users/:id', authenticated, userController.putUserEdit)

// JWT signin
router.post('/signin', userController.signIn)


module.exports = router
