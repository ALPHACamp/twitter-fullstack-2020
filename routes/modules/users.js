// This modules is for user and profile routers
const express = require("express");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;
const userController = require("../../controllers/userController")

router.get("/signout", userController.signOut);
router.get("/profile", (req, res) => {
  return res.render("profile");
});
router.get("/:id/edit", (req, res) => {
  return res.render("setting");
});
router.put("/:id", (req, res) => {
  //revise account setting
});
router.get("/:id/main", (req, res) => {
  return res.render("index");
});
router.get("/", (req, res) => {
  return res.redirect(`users/${req.user.id}/main`);
});
module.exports = router;
