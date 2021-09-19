// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const router = express.Router();
const db = require("../../models");
const { User, Twitter, Reply } = db;

router.get("/", (req, res) => {
  return res.render("index");
});

module.exports = router;
