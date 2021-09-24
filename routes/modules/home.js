// This modules is for index view page
const express = require("express");
const userController = require("../../controllers/userController");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;
const passport =require('passport')

router.get("/signup", userController.signupPage);
router.get("/signin", userController.signInPage);
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/signin'
}))
router.post("/signup", userController.signup);
router.get("/", (req, res) => {
  // 先寫死等使用者出來
  return res.redirect("profiles/2/main");
});

module.exports = router;
