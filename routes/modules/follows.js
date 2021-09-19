// This modules is for follows and likes
const express = require("express");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

router.get("/", (req, res) => {
  return res.send("index");
});

module.exports = router;
