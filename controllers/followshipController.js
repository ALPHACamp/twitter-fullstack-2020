const db = require("../models");
const { User, Tweet, Reply, Like } = db;
const moment = require("moment");

//for test only
const helpers = require("../_helpers.js");
const getTestUser = function (req) {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};

const followshipController = {
  getFollowers: (req, res) => {},
  getFollowings: (req, res) => {},
  postFollowers: (req, res) => {},
  deleteFollowers: (req, res) => {},
};

module.exports = followshipController;
