const db = require("../models");
const { User, Tweet, Followship } = db;
const { getTestUser, getTopUsers } = require("../services/generalService");

const listAttributes = ["id", "name", "account", "introduction", "updatedAt", "avatar"];

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
            include: { model: User, as: "Followers", attributes: ["id"], order: [["createdAt", "ASC"]] }
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
          { model: User, as: "Followings", attributes: listAttributes, order: [["createdAt", "ASC"]] }
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
    const followingId = (req.body.id !== undefined) ? Number(req.body.id) : Number(req.params.id);
    const followerId = getTestUser(req).id;

    if (followerId === followingId) {
      req.flash("error_messages", "can not follow self");
      console.log("can not follow self");
      return res.redirect(200, "back");
    } else {
      Followship.findOrCreate({
        where: {
          followerId: followerId,
          followingId: followingId
        }
      })
        .then(() => {
          res.redirect('back');
        })
        .catch((error) => console.log(error));
    }
  },

  deleteFollowing: (req, res) => {
    const user = getTestUser(req);
    return Followship.destroy({
      where: { followerId: user.id, followingId: req.params.id }
    })
      .then(() => res.redirect("back"))
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
