const express = require("express");
const router = express.Router();

const usersRouter = require("./modules/users");
const adminRouter = require("./modules/admin");
const tweetsRouter = require("./modules/tweets");
// const followshipRouter = require("./modules/followships");
const homeRouter = require("./modules/home");
const apis = require("./modules/apis");
const authenticationHelper = require("../middleware/authenticationHelper");

const followshipController = require("../controllers/followshipController");

router.use("/", homeRouter);
router.use("/users", authenticationHelper.authenticatedNonAdmin, usersRouter);
router.use("/admin", authenticationHelper.authenticatedAdmin, adminRouter);
router.use("/tweets", authenticationHelper.authenticatedNonAdmin, tweetsRouter);
// router.use("/followships", authenticationHelper.authenticatedNonAdmin, followshipRouter);
router.use("/api", apis);

// test only
router.post("/followships", authenticationHelper.authenticatedNonAdmin, followshipController.addFollowing);
router.post("/followships/:id", authenticationHelper.authenticatedNonAdmin, followshipController.addFollowing);
router.delete("/followships/:id", authenticationHelper.authenticatedNonAdmin, followshipController.deleteFollowing);

module.exports = router;
