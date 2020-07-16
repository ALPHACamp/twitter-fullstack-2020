const express = require("express");
const tweetController = require("../controllers/tweetController");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/home");
});
router.get("/home", tweetController.getTweets);
//user routes
router.get("/users/:id", userController.getUser);
module.exports = router;
