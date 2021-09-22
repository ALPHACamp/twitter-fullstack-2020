// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const profileController = require("../../controllers/profileController");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

router.get("/:id/posts", profileController.getPosts)
router.get("/:id/comments", profileController.getComments)
router.get("/:id/likedPosts", profileController.getLikedPosts)

module.exports = router;
