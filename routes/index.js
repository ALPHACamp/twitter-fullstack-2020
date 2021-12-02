const adminController = require("../controllers/adminController.js")
const userController = require("../controllers/userController.js")
const tweetController = require("../controllers/tweetController.js")

module.exports = (app, passport) => {
  //驗証使用者已登入
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role === "user") {
        return next()
      }
      return res.redirect("/admin")
    }
    res.redirect("/signin")
  }
  //驗証Admin已登入
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role === "admin") {
        return next()
      }
      return res.redirect("/")
    }
    res.redirect("/admin/signin")
  }

  //首頁
  app.get("/", authenticated, (req, res) => res.redirect("/tweets"))
  app.get("/admin", authenticatedAdmin, (req, res) => res.redirect("/admin/tweets"))

  //admin登入
  app.get("/admin/signin", adminController.signInPage)

  //admin管理推文
  app.get("/admin/tweets", authenticatedAdmin, adminController.getTweets)

  //admin管理使用者
  app.get("/admin/users", authenticatedAdmin, adminController.getUsers)

  //使用者登入
  app.get("/signin", userController.signInPage)
  app.post("/signin", passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }), userController.signIn)
  app.get("/logout", userController.logout)

  //使用者註冊
  app.get("/signup", userController.signUpPage)
  app.post("/signup", userController.signUp)

  //使用者推文
  app.get("/tweets", authenticated, tweetController.getTweets)
}
