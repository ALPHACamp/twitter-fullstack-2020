// This modules is for admin-related roters
const express = require("express");
const adminController = require("../../controllers/adminController");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

router.get("/", (req, res) => {
  return res.send("index");
});

router.get("/posts", adminController.getPosts)
router.delete('/posts/:id', adminController.deletePost)
router.get("/users", adminController.getUsers)

module.exports = router;
