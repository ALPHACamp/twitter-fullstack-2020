const express = require('express')
const router = express.Router()
const passport = require('passport')

const auth = require('../config/auth')
const userController = require('../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/', (req, res) => res.redirect('/signin'))

// 一般使用者登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

// Admin
router.get('/admin/signin', userController.AdminSignInPage)
router.post('/admin/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin', failureFlash: true
}), userController.AdminSignIn)
router.get('/admin/tweets', auth.authenticatedAdmin, (req, res) => res.render('tweets'))

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signout', userController.logout)

router.get('/tweets', auth.authenticatedUser, (req, res) => res.render('tweets'))

router.get('/followships', auth.authenticatedUser, userController.addFavorite)
router.delete('/followships/:id', auth.authenticatedUser, userController.removeFavorite)

// user edit 相關路由
router.get('/api/users/:id', auth.authenticatedUser, userController.editUser)
router.put('/users/:id/edit', auth.authenticatedUser,
  upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUserInfo)
router.get('/users/:id/followers', auth.authenticatedUser, userController.getRecommendedFollowings, userController.getUserFollowers) // 被追蹤
router.get('/users/:id/followings', auth.authenticatedUser, userController.getRecommendedFollowings, userController.getUserFollowings) // 追蹤人

// setting 相關路由
router.get('/users/:id/setting', auth.authenticatedUser, userController.getSetting)
router.post('/api/users/:id', auth.authenticatedUser, userController.putSetting)

router.post('/tweets/:tweetId/like', auth.authenticatedUser, userController.addLike)
router.delete('/tweets/:tweetId/unlike', auth.authenticatedUser, userController.removeLike)

module.exports = router
