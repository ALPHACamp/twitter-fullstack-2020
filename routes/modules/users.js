// This modules is for user and profile routers
const express = require("express");
const router = express.Router();
const userController = require("../../controllers/usercontroller");
const followshipController = require("../../controllers/followshipController");
const profileController = require("../../controllers/profileController");
const multer = require("multer");
const upload = multer({ dest: "temp/" });
const { authenticated } = require("../../middleware/authenticationHelper");

router.get("/signout", authenticated, userController.signOut);

router.get("/:id/tweets", authenticated, profileController.getPosts);
router.get("/:id/comments", authenticated, profileController.getComments);
router.get("/:id/likes", authenticated, profileController.getLikedPosts);
router.get("/:id/followers", authenticated, followshipController.getFollowers);
router.get("/:id/followings", authenticated, followshipController.getFollowings);
router.get("/:id/edit", authenticated, userController.getUserSetting);
router.post("/:id/edit", authenticated, userController.editUserSetting);
router.put(
  "/:id/edit",
  authenticated,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "avatar", maxCount: 1 }
  ]),
  profileController.putUserpage
);

router.put("/:id/notification", authenticated, followshipController.putNotification);

module.exports = router;
