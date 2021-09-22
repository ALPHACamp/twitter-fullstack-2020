// This modules is for user and profile routers
const express = require("express");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

router.get("/", (req, res) => {
  return res.redirect(`users/${req.user.id}/main`);
});
router.get("/profile", (req, res) => {
  return res.render("profile");
});
router.post("/signout", (req, res) => {
  //signout action
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
module.exports = router;
