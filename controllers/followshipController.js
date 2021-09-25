const db = require("../models");
const { User, Tweet, Followship } = db;
const { Op } = require("sequelize");
const moment = require("moment");
const { getTestUser } = require("./util.service");
//for test only

const listAttributes = [
  "id",
  "name",
  "account",
  "introduction",
  "updatedAt",
  "avatar",
];
const listAttributesTop = ["id", "name", "account", "avatar"];

const followshipController = {
  getFollowers: async (req, res) => {
    let rankedUsers;
    try {
      let profile = await User.findByPk(req.params.id, {
        attributes: ["id", "name"],
        include: [
          { model: Tweet, attributes: ["id"] },
          {
            model: User,
            as: "Followers",
            attributes: listAttributes,
            include: { model: User, as: "Followers", attributes: ["id"] },
          },
        ],
      });

      profile = profile.toJSON();
      profile.tweetCount = profile.Tweets.length;
      profile.Followers.forEach((follower) => {
        const arr = follower.Followers.map((el) => el.id);
        if (arr.indexOf(profile.id) > -1) follower.isFollowed = true;
        else follower.isFollowed = false;
        follower.updatedAtFormated = moment(follower.updatedAt).fromNow();

        //get top users
        User.findAll({
          attributes: listAttributesTop,
          include: [{ model: User, as: "Followers", attributes: ["id"] }],
          where: {
            id: { [Op.not]: getTestUser(req).id },
            role: { [Op.not]: "admin" },
          },
        })
          .then((rawUsers) => {
            rankedUsers = rawUsers
              .map((data) => ({
                ...data.dataValues,
                FollowerCount: data.Followers.length,
                isFollowed: getTestUser(req)
                  .Followings.map((d) => d.id)
                  .includes(data.id),
              }))
              .sort((a, b) => b.FollowerCount - a.FollowerCount);
            rankedUsers = rankedUsers.slice(0, 10);
          })
          .then(() => {
            return res.render("followship", {
              tagA: true,
              profile,
              followers: profile.Followers,
              users: rankedUsers,
            });
          });
      });
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  },

  getFollowings: async (req, res) => {
    let rankedUsers;
    try {
      let profile = await User.findByPk(req.params.id, {
        attributes: ["id", "name"],
        include: [
          { model: Tweet, attributes: ["id"] },
          { model: User, as: "Followings", attributes: listAttributes },
        ],
      });
      profile = profile.toJSON();
      profile.Followings.forEach((following) => {
        following.updatedAtFormated = moment(following.updatedAt).fromNow();
      });
      profile.tweetCount = profile.Tweets.length;

      //get top users
      let rankedUsers = await User.findAll({
        attributes: listAttributesTop,
        include: [{ model: User, as: "Followers", attributes: ["id"] }],
        where: {
          id: { [Op.not]: getTestUser(req).id },
          role: { [Op.not]: "admin" },
        },
      });
      rankedUsers = rankedUsers
        .map((data) => ({
          ...data.dataValues,
          FollowerCount: data.Followers.length,
          isFollowed: getTestUser(req)
            .Followings.map((d) => d.id)
            .includes(data.id),
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      rankedUsers = rankedUsers.slice(0, 10);

      return res.render("followship", {
        tagB: true,
        profile: profile,
        followings: profile.Followings,
        users: rankedUsers,
      });
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  },

  addFollowing: (req, res) => {
    const user = getTestUser(req);
    if (user.id === req.params.id) {
      console.error("Cannot follow yourself");
      return res.redirect("back");
    }
    return Followship.findOrCreate({
      where: {
        followerId: Number(user.id),
        followingId: Number(req.params.id),
      },
    })
      .then((data) => {
        res.redirect("back");
      })
      .catch((error) => res.status(400).json(error));
  },

  deleteFollowing: (req, res) => {
    const user = getTestUser(req);
    return Followship.destroy({
      where: { followerId: user.id, followingId: req.params.id },
    })
      .then(() => res.redirect("back"))
      .catch((error) => res.status(400).json(error));
  },
  putNotification: (req, res) => {
    const user = getTestUser(req);
    return Followship.findOne({
      where: {
        followerId: Number(user.id),
        followingId: Number(req.params.userId),
      },
    }).then((followship) => {
      if (!followship) {
        console.error(
          "You cannot get notification for someone you don't follow"
        );
      } else {
        followship.notification = !notification;
      }
      return res.redirect("back");
    });
  },
};

module.exports = followshipController;
