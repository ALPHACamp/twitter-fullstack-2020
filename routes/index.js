const userController = require("../controllers/userController.js")
module.exports = (app) => {
  //使用者登入
  app.get("/signin", userController.signInPage)

  //使用者註冊
  app.get("/signup", userController.signUpPage)
  app.post("/signup", userController.signUp)
}
