const express = require("express");
const router = express.Router();

const usersRouter = require("./modules/users");
const adminRouter = require("./modules/admin");
const postsRouter = require("./modules/posts");
const followsRouter = require("./modules/follows");
const homeRouter = require("./modules/home");

router.use("/users", usersRouter);
router.use("/admin", adminRouter);
router.use("/posts", postsRouter);
router.use("/follows", followsRouter);
router.use("/", homeRouter);

module.exports = router;
