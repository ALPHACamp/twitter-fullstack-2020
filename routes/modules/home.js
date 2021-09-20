// This modules is for index view page
const express = require("express");
const userController = require("../../controllers/userController");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

router.get("/", (req, res) => {
  return res.redirect("profiles/:id/main");
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.get("/signin", userController.signInPage);
router.post("/signin", userController.signIn);
router.post("/signup", (req, res) => {
  //send signup info
});

module.exports = router;
