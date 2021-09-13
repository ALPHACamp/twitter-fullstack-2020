const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const userController = require("../controllers/userController.js");
const multer = require("multer");
const upload = multer({ dest: "temp/" });

const helpers = require("../_helpers.js");

//設定只有當test模式下使用helper登入
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
//router info middleware
if (process.env.NODE_ENV !== "production") {
  router.use(function (req, res, next) {
    console.log(`method: ${req.method}, router: ${req.url}`);
    next();
  });
}

//user login/out
router.get("/signin", userController.signInPage);

//profile main page
router.get("/profile/:id/main", userController.profilePage);

//homepage redirection
router.get("/", (req, res) => res.redirect("/users/:id/main"));

module.exports = router;