const userController = require("../controllers/userController");
const tweetController = require("../controllers/tweetController");
const adminController = require('../controllers/adminController')
const chatRoomController = require('../controllers/chatRoomController')
const helpers = require('../_helpers.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })



// const user = require("../models/user");

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      // isAuthenticated 為passport內建之方法,回傳true or false
      return next();
    }
    res.redirect("/signin");
  };

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.role) { return next() }  //如果是管理員的話
      req.logout() //將passport給的憑證洗掉
      req.flash('error_messages', '您非管理員，請從前台登入')
      return res.redirect('/admin/signin') //如果不是就導回首頁
    }
    res.redirect("/signin");
  };

  const signinBlocker = (req, res, next) => { //block掉回到登入頁
    if (helpers.ensureAuthenticated(req)) {
      return res.redirect('back')
    }
    return next()
  };

  // /users/{ { user.id } } /edit

  //user login
  app.put('/users/:id/edit', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putSelf)
  app.get("/signup", signinBlocker, userController.signUpPage);
  app.post("/signup", userController.signUp);
  app.get("/signin", signinBlocker, userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true,
    }),
    userController.signIn
  );
  app.get("/logout", userController.logout);
  app.get("/users/:id/setting", authenticated, userController.getSetting);
  app.put("/users/:id/setting", authenticated, userController.putSetting)

  //userController
  app.get('/users/:id', authenticated, userController.getTopFollowers, userController.getUser)
  app.get('/users/:id/follower', authenticated, userController.getTopFollowers, userController.getFollower)
  app.get('/users/:id/following', authenticated, userController.getTopFollowers, userController.getFollowing)
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)
  app.get('/users/:id/likes', authenticated, userController.getTopFollowers, userController.getUserLikes)
  app.get('/users/:id/replies', authenticated, userController.getTopFollowers, userController.getUserReplies)
  app.post("/like/:id", authenticated, userController.addLike);
  app.delete("/unlike/:id", authenticated, userController.removeLike);


  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);
  app.get("/signin", userController.signIn);

  //tweetController
  app.get("/", (req, res) => res.redirect("/tweets"));
  app.get("/tweets", authenticated, userController.getTopFollowers, tweetController.getTweets);
  app.get("/tweets/:id", authenticated, userController.getTopFollowers, tweetController.getTweet);
  app.post('/tweets/:id', authenticated, tweetController.postTweet)
  app.post('/tweets/:id/replies', authenticated, tweetController.postReply)
  app.get('/tweets/:id/replies', authenticated, tweetController.getReply)

  //adminController 
  app.get('/admin/signin', signinBlocker, adminController.signinPage)
  app.post('/admin/signin', passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }), adminController.signIn)

  app.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/tweets') })
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  //chatRoomController
  app.get('/chatRoom', authenticated, chatRoomController.getChatRoom)


  //chat
  app.get('/chat', (req, res) => res.render('chat'))


}