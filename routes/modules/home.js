// This modules is for index view page
const express = require("express");
const userController = require("../../controllers/userController");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

router.get("/signup", userController.signupPage);
router.get("/signin", userController.signInPage);
router.post("/signin", userController.signIn);
router.post("/signup", userController.signup);
router.get("/", (req, res) => {
  return res.redirect("profiles/:id/main");
});

module.exports = router;
