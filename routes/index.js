const userController = require("../controllers/userController");
const tweetController = require("../controllers/tweetController");
const adminController = require('../controllers/adminController')
const helpers = require('../_helpers.js')


module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect("/signin");
  };

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.role) { return next() }  //如果是管理員的話
      req.flash('error_messages', '您非管理員，請從前台登入')
      return res.redirect('/admin/signin') //如果不是就導回首頁
    }
    res.redirect("/signin");
  };


  //user login
  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);
  app.get("/signin", userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true,
    }),
    userController.signIn
  );
  app.get("/logout", userController.logout);
<<<<<<< HEAD

  app.get("/setting", userController.getSetting);
  app.put("/setting", userController.putSetting)


=======
  // app.get("/main", (req, res) => res.render("mainpage"));

  //userController
  app.get('/users/:id', authenticated, userController.getUser)  
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)
  app.post("/like/:id",authenticated, userController.addLike);
  app.delete("/unlike/:id",authenticated, userController.removeLike);
  
>>>>>>> 9c068e27e81eb24a89551dc3c93179ea140686d6
  // adminController
  app.get("/admin", (req, res) => {
    res.redirect("/admin/tweets");
  });
  app.get("/admin/tweets", adminController.getTweets);
  app.post("/admin/tweets/:id", adminController.deleteTweet);


  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);
  app.get("/signin", userController.signIn);
<<<<<<< HEAD


  //tweetController
  app.get("/", authenticated, (req, res) => res.redirect("/tweets"));
  app.get("/tweets", authenticated, tweetController.getTweets);
  app.get("/tweets/:id", authenticated, tweetController.getTweet);
  app.post('/tweets', authenticated, tweetController.postTweet)
  app.get('/tweets/user', authenticated, tweetController.getUser)

  app.post("/tweets/:id/like", authenticated, tweetController.addLike);
  app.delete("/tweets/:id/unlike", authenticated, tweetController.removeLike);
=======
  
  //tweetController
  app.get("/main", (req, res) => res.redirect("/tweets"));
  app.get("/tweets",authenticated, tweetController.getTweets);
  app.get("/tweets/:id",authenticated, tweetController.getTweet);
  app.post('/tweets/:id',authenticated, tweetController.postTweet)


  app.post('/tweets/:id/replies',authenticated, tweetController.postReply)
  app.get('/tweets/:id/replies',authenticated, tweetController.getReply)
>>>>>>> 9c068e27e81eb24a89551dc3c93179ea140686d6

  app.post('/tweets/:id/replies', authenticated, tweetController.postReply)
  app.get('/tweets/:id/replies', authenticated, tweetController.getReply)

  //adminController 
  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin', passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }), adminController.signIn)


  app.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/tweets') })
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.post('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)


}
