const passport = require("passport");
const bcrypt = require("bcryptjs");
const { urlencoded } = require("express");

//for test only
const helpers = require("../_helpers.js");
const getTestUser = function (req) {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};

const userController = {
  signInPage: (req, res) => {
    return res.render("signin");
  },
  signIn: (req, res) => {
    //put some sign in strategy here
  },

  registerPage: (req, res) => {
    return res.render("register");
  },
};

module.exports = userController;
