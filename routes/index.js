const express = require("express");
const router = express.Router();

const usersRouter = require("./modules/users");
const adminRouter = require("./modules/admin");
const tweetsRouter = require("./modules/tweets");
const followshipRouter = require("./modules/followships");
const homeRouter = require("./modules/home");
const apis = require('./modules/apis');
const authenticationHelper = require('../middleware/authenticationHelper');



router.use("/", homeRouter);
router.use("/users", authenticationHelper.authenticatedNonAdmin, usersRouter);
router.use("/admin", authenticationHelper.authenticatedAdmin, adminRouter);
router.use("/tweets", authenticationHelper.authenticatedNonAdmin, tweetsRouter);
router.use("/followships", authenticationHelper.authenticatedNonAdmin, followshipRouter);
router.use("/api", apis)

module.exports = router;
