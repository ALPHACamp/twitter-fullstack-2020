const userController = require("../controllers/userController.js")
const tweetController = require("../controllers/tweetController.js")

module.exports = (app, passport) => {
  //驗証使用者已登入
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect("/signin")
  }
  //驗証Admin已登入
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect("/")
    }
    res.redirect("/admin/signin")
  }

  //首頁
  app.get("/", authenticated, (req, res) => res.redirect("/tweets"))

  //admin登入
  // app.get("/admin", authenticatedAdmin, (req, res) => res.redirect("/admin/restaurants"))
  // app.get("/admin/tweets", authenticatedAdmin, adminController.getRestaurants)
  // app.get("/admin/users", authenticatedAdmin, adminController.getRestaurants)

  //使用者登入
  app.get("/signin", userController.signInPage)
  app.post("/signin", passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }), userController.signIn)
  app.get("/logout", userController.logout)

  //使用者註冊
  app.get("/signup", userController.signUpPage)
  app.post("/signup", userController.signUp)

  //推文
  app.get("/tweets", authenticated, tweetController.getTweets)
}
