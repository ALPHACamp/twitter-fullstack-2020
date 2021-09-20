const db = require("../models");
const { User, Tweet, Reply, Like, Followship } = db;
const moment = require("moment");
const { dummyuser } = require("../../dummyuser.json");
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
  getFollowers: async (req, res) => {
    const user = dummyuser;
    console.log("dummyuser: ", dummyuser);
    const followings = await User.findAll({
      include: { model: User, as: "Followings" },
      where: { FollowerId: user.id },
    });
    const followers = await User.findAll({
      include: { model: User, as: "Followers" },
      where: { FollowingId: user.id },
    })
      .then(() => {
        console.log("following 1:", followings[0]);
        console.log("follower 1:", followers[0]);
        return res.redirect("back");
      })
      .catch((error) => res.status(400).json(error));
  },

  getFollowings: (req, res) => {
    const user = dummyuser;
    res.send("getFollowings!");
  },

  postFollowers: (req, res) => {
    const user = dummyuser;
    return Followship.create({
      FollowerId: user.id,
      FollowingId: req.params.userId,
    })
      .then((followship) => {
        console.log("created followship: ", followship);
        return res.redirect("back");
      })
      .catch((error) => res.status(400).json(error));
  },

  deleteFollowers: (req, res) => {
    const user = dummyuser;
    return Followship.findOne({
      where: { FollowerId: user.id, FollowingId: req.params.userId },
    }).then(() => {
      Followship.destroy()
        .then((followship) => {
          console.log("destroyed followship: ", followship);
          return res.redirect("back");
        })
        .catch((error) => res.status(404).json(error));
    });
  },
};

module.exports = followshipController;
