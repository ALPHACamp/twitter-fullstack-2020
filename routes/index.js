const userController = require("../controllers/userController");
const tweetController = require("../controllers/tweetController");
const adminController = require("../controllers/adminController");

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      // isAuthenticated 為passport內建之方法,回傳true or false
      return next();
    }
    res.redirect("/signin");
  };

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAmin) {
        return next();
      } //如果是管理員的話
      return res.redirect("/"); //如果不是就導回首頁
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
  app.get("/main", (req, res) => res.render("mainpage"));

  // adminController
  app.get("/admin", (req, res) => {
    res.redirect("/admin/tweets");
  });
  app.get("/admin/tweets", adminController.getTweets);
  app.post("/admin/tweets/:id", adminController.deleteTweet);

  //tweetController
  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);
  app.get("/signin", userController.signIn);

  app.get("/", (req, res) => res.redirect("/tweets"));
  app.get("/tweets", tweetController.getTweets);
  app.get("/tweets/:id", tweetController.getTweet);

  app.post("/like/:tweetId", tweetController.addLike);
  app.delete("/like/:tweetId", tweetController.removeLike);
};
