// This modules is for admin-related roters
const express = require("express");
const adminController = require("../../controllers/adminController");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;


router.get("/tweets", adminController.getPosts)
router.delete('/tweets/:id', adminController.deletePost)
router.get("/users", adminController.getUsers)
router.get('/signout', adminController.signOut)

module.exports = router;
