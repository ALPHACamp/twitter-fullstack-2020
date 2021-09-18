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
    return res.render("login");
  },

  profilePage: (req, res) => {
    return res.render("main");
  },
};

module.exports = userController;
