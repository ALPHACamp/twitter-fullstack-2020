const db = require("../models");
const { User, Tweet, Followship } = db;
const { Op } = require("sequelize");
const moment = require("moment");
const { getTestUser, getMyProfile, getTopUsers } = require("../services/generalService");
//for test only

const listAttributes = ["id", "name", "account", "introduction", "updatedAt", "avatar"];
const listAttributesTop = ["id", "name", "account", "avatar"];

const followshipController = {
  getFollowers: async (req, res) => {
    const user = getTestUser(req);
    try {
      const TopUsers = await getTopUsers(user);
      let profile = await User.findByPk(req.params.id, {
        attributes: ["id", "name"],
        include: [
          { model: Tweet, attributes: ["id"] },
          {
            model: User,
            as: "Followers",
            attributes: listAttributes,
            include: { model: User, as: "Followers", attributes: ["id"], order: [["createdAt", "DESC"]] }
          }
        ]
      });
      profile.tweetCount = profile.Tweets.length;
      profile.Followers.forEach((follower) => {
        follower.isFollowed = follower.Followers.map((el) => el.id).includes(profile.id);
      });

      return res.render("followship", {
        tagA: true,
        profile,
        followers: profile.Followers,
        users: TopUsers
      });
      process.exit();
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },

  getFollowings: async (req, res) => {
    const user = getTestUser(req);
    try {
      let profile = await User.findByPk(req.params.id, {
        attributes: ["id", "name"],
        include: [
          { model: Tweet, attributes: ["id"] },
          { model: User, as: "Followings", attributes: listAttributes }
        ]
      });
      profile = profile.toJSON();
      profile.tweetCount = profile.Tweets.length;
      const TopUsers = await getTopUsers(user);

      return res.render("followship", {
        tagB: true,
        profile,
        followings: profile.Followings,
        users: TopUsers
      });
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  },

  addFollowing: (req, res) => {
    const user = getTestUser(req);
    if (user.id === req.params.id) {
      req.flash("error_messages", "can not follow self");
      console.error("can not follow self");
      return res.redirect("back");
    }
    return Followship.findOrCreate({
      where: {
        followerId: Number(user.id),
        followingId: Number(req.params.id)
      }
    })
      .then((data) => {
        res.redirect(200, "back");
      })
      .catch((error) => res.status(400).json(error));
  },

  deleteFollowing: (req, res) => {
    const user = getTestUser(req);
    return Followship.destroy({
      where: { followerId: user.id, followingId: req.params.id }
    })
      .then(() => res.redirect(200, "back"))
      .catch((error) => res.status(400).json(error));
  },
  putNotification: (req, res) => {
    const user = getTestUser(req);
    return Followship.findOne({
      where: {
        followerId: Number(user.id),
        followingId: Number(req.params.id)
      }
    }).then((followship) => {
      if (!followship) {
        console.error("You cannot get notification for someone you don't follow");
      } else {
        followship.notification = !followship.notification;
        followship.save();
      }
      return res.redirect("back");
    });
  }
};

module.exports = followshipController;
