// This modules is for admin-related roters
const express = require("express");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

router.get("/", (req, res) => {
  return res.send("index");
});

module.exports = router;
