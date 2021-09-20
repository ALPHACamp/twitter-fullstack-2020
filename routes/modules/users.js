// This modules is for user and profile routers
const express = require("express");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;
//以下路由為方便測試使用 可刪
router.get("/", (req, res) => {
  return res.render("index");
});
router.get("/login", (req, res) => {
  return res.render("login");
});
router.get("/post", (req, res) => {
  return res.render("post");
});
router.get("/profile", (req, res) => {
  return res.render("profile");
});
router.get("/signin", (req, res) => {
  return res.render("signin");
});
router.get("/setting", (req, res) => {
  return res.render("setting");
});
module.exports = router;
