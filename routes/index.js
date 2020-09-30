const userController = require("../controllers/userController");
const tweetController = require("../controllers/tweetController");

module.exports = (app) => {
  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);
  app.get("/signin", userController.signIn);

  app.get("/", (req, res) => res.redirect("/tweets"));
  app.get("/tweets", tweetController.getTweets);
  app.get("/tweets/:id", tweetController.getTweet);

  app.post("/like/:tweetId", tweetController.addLike);
  app.delete("/like/:tweetId", tweetController.removeLike);
};
