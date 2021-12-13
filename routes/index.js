const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const tweetController = require("../controllers/tweetController");
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const db = require("../models");
const User = db.User;


module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  const isAdmin = (req, res, next) => {
    User.findOne({where: { email: req.body.email }})
    .then(user=>{
      if(!user){
        next()
      }else if(user.toJSON().isAdmin){
        req.flash('error_messages', '此為admin帳戶，請註冊使用者帳戶')
        res.redirect('/signin') 
      }else{
        next()
      }
    })
  }

  app.get('/chat', authenticated, (req, res) => res.render('chatroom'))
  app.get('/mailbox', authenticated, (req, res) => res.render('mailbox'))
  app.get('/mailbox/:id', authenticated, userController.getMailPage)

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  app.get("/admin/tweets", authenticatedAdmin, adminController.getTweets);
  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin', passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }), adminController.signIn)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', isAdmin, passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logout)


  app.get("/", (req, res) => res.redirect("/tweets"))
  app.get("/tweets", authenticated, userController.getUsersHavingTopFollowers, tweetController.getTweets)
  app.get("/tweets/:id", authenticated, userController.getUsersHavingTopFollowers, tweetController.getTweet)
  app.post('/tweets', authenticated, tweetController.createTweet)
  app.post('/tweets/:id/replies', authenticated, tweetController.postReply)
  app.get('/tweets/:id/replies', authenticated, tweetController.getReply)




  // add like
  app.post('/like/:tweetId', authenticated, tweetController.addLike)
  app.delete('/like/:tweetId', authenticated, tweetController.removeLike)
  // setting使用者能編輯自己的 account、name、email 和 password
  app.get('/setting', authenticated, userController.getUsersHavingTopFollowers, userController.getSetting)
  app.put('/setting', authenticated, userController.putSetting)


  // 使用者能編輯自己的自我介紹、個人頭像與封面
  app.get('/user/self/:id', authenticated, userController.getTweet)
  app.put('/users/:id/edit', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'background', maxCount: 1 }]), userController.putSelf)


  app.get('/user/:id/follower', userController.getUsersHavingTopFollowers, authenticated, userController.getFollower)
  app.get('/user/:id/following', userController.getUsersHavingTopFollowers, authenticated, userController.getFollowing)
  app.get('/user/:id/tweets', authenticated, userController.getUsersHavingTopFollowers, userController.getTweets)
  app.get('/user/:id/replies', authenticated, userController.getUsersHavingTopFollowers, userController.getReplies)
  app.get('/user/:id/likes', authenticated, userController.getUsersHavingTopFollowers, userController.getlikes)


  app.post('/following/:id', authenticated, userController.addFollowing)
  app.delete('/following/:id', authenticated, userController.removeFollowing)

  // app.get("/user/other/:id", userController.otherUser)
}



