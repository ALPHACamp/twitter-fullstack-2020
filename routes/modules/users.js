// This modules is for user and profile routers
const express = require("express");
const router = express.Router();
const db = require("../../models");
const userController = require("../../controllers/userController");
const followshipController = require("../../controllers/followshipController");
const profileController = require("../../controllers/profileController");
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get("/signout", userController.signOut);

router.get("/:id/tweets", profileController.getPosts);
router.get("/:id/comments", profileController.getComments);
router.get("/:id/likes", profileController.getLikedPosts);
router.get("/:id/followers", followshipController.getFollowers);
router.get("/:id/followings", followshipController.getFollowings);
router.get("/:id/edit", userController.getUserSetting)
router.post("/:id/edit", userController.editUserSetting)
router.put('/:id/edit', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), profileController.putUserpage)

router.put("/:id/notification", followshipController.putNotification);

module.exports = router;
