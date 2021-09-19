// This modules is for index view page
const express = require("express");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

router.get("/", (req, res) => {
  return res.render("index");
});

module.exports = router;
