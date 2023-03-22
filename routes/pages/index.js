const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const upload = require('../../middleware/multer')
const { generalErrorHandler } = require('../../middleware/error-handler') // 加

// Contollers
const pageController = require('../../controllers/pages/page-controller')
const userController = require('../../controllers/pages/page-controller')


// router.use('/admin', authenticatedAdmin, admin) // 新增這行
// router.get('/signup', userController.signUpPage)
// router.post('/signup', userController.signUp) // 注意用 post
// router.get('/signin', userController.signInPage)
// router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
// router.get('/logout', userController.logout)
// router.get('/users/top', authenticated, userController.getTopUsers)
// router.get('/users/:id/edit', authenticated, userController.editUser)
// router.get('/users/:id', authenticated, userController.getUser)
// router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)


router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler) // 加入這行
module.exports = router
