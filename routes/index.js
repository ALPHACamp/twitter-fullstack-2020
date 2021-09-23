const express = require("express");
const router = express.Router();

const passport = require("../config/passport");
const usersRouter = require("./modules/users");
const profilesRouter = require("./modules/profiles");
const adminRouter = require("./modules/admin");
const postsRouter = require("./modules/posts");
const followshipRouter = require("./modules/followships");
const homeRouter = require("./modules/home");
const helpers = require("../_helpers");

const authenticated = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
  } else {
    if (req.isAuthenticated()) {
      return next();
    }
  }
  res.redirect("/signin");
};

const authenticatedAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next();
      }
      return res.redirect("/");
    }
  }
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    }
    return res.redirect("/");
  }
  res.redirect("/signin");
};

router.use("/users", authenticated, usersRouter);
router.use("/admin", authenticatedAdmin, adminRouter);
router.use("/posts", authenticated, postsRouter);
router.use("/profiles", authenticated, profilesRouter);
router.use("/followships", authenticated, followshipRouter);
router.use("/", homeRouter);

// router.use("/users", usersRouter);
// router.use("/admin", adminRouter);
// router.use("/posts", postsRouter);
// router.use("/profiles", profilesRouter);
// router.use("/followships", followshipRouter);
// router.use("/", homeRouter);

module.exports = router;
