const express = require("express");
const router = express.Router();

const passport = require("../config/passport");
const usersRouter = require("./modules/users");
const adminRouter = require("./modules/admin");
const postsRouter = require("./modules/posts");
const followshipRouter = require("./modules/followships");
const homeRouter = require("./modules/home");
const helpers = require("../_helpers");

const authenticated = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'user') {
        return next()
      }
      return res.redirect("/admin/tweets")
    }
  } else {
    if (req.isAuthenticated()) {
      if (req.user.role === 'user') {
        return next();
      }
      return res.redirect("/admin/tweets")
    }
  }
  res.redirect("/signin");
};

const authenticatedAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next();
      }
      return res.redirect("/tweets");
    }
  } else {
    if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
        return next();
      }
      return res.redirect("/tweets");
    }
    res.redirect("/admin/signin");
  };
}


router.use("/", homeRouter);
router.use("/users", authenticated, usersRouter);
router.use("/admin", authenticatedAdmin, adminRouter);
router.use("/tweets", authenticated, postsRouter);
router.use("/followships", authenticated, followshipRouter);

// router.use("/users", usersRouter);
// router.use("/admin", adminRouter);
// router.use("/tweets", postsRouter);
// router.use("/profiles", profilesRouter);
// router.use("/followships", followshipRouter);
// router.use("/", homeRouter);

module.exports = router;
