const userController = require("../controllers/userController.js")
const tweetController = require("../controllers/tweetController.js")
module.exports = (app, passport) => {
  //首頁
  app.get("/", (req, res) => res.redirect("/tweets"))

  //使用者登入
  app.get("/signin", userController.signInPage)
  app.post("/signin", passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }), userController.signIn)
  app.get("/logout", userController.logout)

  //使用者註冊
  app.get("/signup", userController.signUpPage)
  app.post("/signup", userController.signUp)

  //推文
  app.get("/tweets", tweetController.getTweets)
}
