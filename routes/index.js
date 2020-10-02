const userController = require("../controllers/userController");
const tweetController = require("../controllers/tweetController");
const adminController = require("../controllers/adminController");

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {  // isAuthenticated 為passport內建之方法,回傳true or false
      if (req.user.role === "1") { return next() }
      return res.redirect('/')
    }
    res.redirect("/signin");
  };

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role === "0") { return next() }  //如果是管理員的話
      return res.redirect('/') //如果不是就導回首頁
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
  // app.get("/main", (req, res) => res.render("mainpage"));

  //userController
  app.get('/users/:id', authenticated, userController.getUser)  

  // adminController
  app.get("/admin", (req, res) => {
    res.redirect("/admin/tweets");
  });
  app.get("/admin/tweets", adminController.getTweets);
  app.post("/admin/tweets/:id", adminController.deleteTweet);


  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);
  app.get("/signin", userController.signIn);
  
  //tweetController
  app.get("/main", (req, res) => res.redirect("/tweets"));
  app.get("/tweets",authenticated, tweetController.getTweets);
  app.get("/tweets/:id",authenticated, tweetController.getTweet);
  app.post('/tweets/:id',authenticated, tweetController.postTweet)
  app.post("/tweets/:id/like",authenticated, tweetController.addLike);
  app.delete("/tweets/:id/unlike",authenticated, tweetController.removeLike);

  app.post('/tweets/:id/replies',authenticated, tweetController.postReply)
  app.get('/tweets/:id/replies',authenticated, tweetController.getReply)

  app.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/tweets') })
  app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
  app.post('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), adminController.signIn)
};

