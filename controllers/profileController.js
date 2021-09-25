const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const { Reply, User, Tweet, Like, Followship } = db;

//for test only
const helpers = require("../_helpers");
const tweetController = require("./tweetController");
const getTestUser = function (req) {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};
const listAttributes = ["id", "name", "account", "avatar"];

const profileController = {
  getPosts: async (req, res, done) => {
    const user = getTestUser(req);
    try {
      // 前端判斷
      const isPost = true;
      //get selfInformation
      const Profile = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: "Followers", attributes: ["id"] },
          { model: User, as: "Followings", attributes: ["id"] },
        ],
      });
      // get selfTweet
      const rawTweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Reply, attributes: ["id"] },
          { model: Like, attributes: ["id"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      const Tweets = await rawTweets.map((data) => ({
        ...data.dataValues,
        ReplyCount: data.Replies.length,
        LikedCount: data.Likes.length,
      }));
      let followship = await Followship.findOne({
        where: {
          followerId: Number(user.id),
          followingId: Number(req.params.id),
        },
      });
      // get Count
      const followersCount = Profile.Followers.length;
      const followingsCount = Profile.Followings.length;
      const tweetsCount = Tweets.length;

      // get TopUser
      const rawUsers = await User.findAll({
        attributes: listAttributes,
        include: [{ model: User, as: "Followers", attributes: ["id"] }],
        where: {
          id: { [Op.not]: user.id },
          role: { [Op.not]: "admin" },
        },
      });
      const Users = await rawUsers
        .map((data) => ({
          ...data.dataValues,
          FollowerCount: data.Followers.length,
          isFollowed: req.user.Followings.map((d) => d.id).includes(data.id),
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      const isSelf = Number(req.params.id) === Number(user.id);
      return res.render("profile", {
        isPost,
        isSelf,
        users: TopUsers,
        tweets: Tweets,
        profile: Profile,
        tweetsCount,
        followersCount,
        followingsCount,
        isFollowed: Boolean(followship),
        notification: Boolean(followship ? followship.notification : false),
      });
      done();
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  },

  getComments: async (req, res, done) => {
    try {
      //前端處理判定
      const isComment = true;
      //get selfInformation
      const Profile = await User.findByPk(req.params.id, {
        include: [
          { model: Tweet, attributes: ["id"] },
          {
            model: Reply,
            include: [
              {
                model: Tweet,
                include: [
                  {
                    model: User,
                    attributes: ["id", "account"],
                  },
                ],
                attributes: ["id", "description"],
              },
            ],
          },
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ],
        order: [["createdAt", "DESC"]],
      });

      const tweetsCount = Profile.Tweets.length;
      const followersCount = Profile.Followers.length;
      const followingsCount = Profile.Followings.length;

      // get TopUser
      const rawUsers = await User.findAll({
        attributes: listAttributes,
        include: [{ model: User, as: "Followers", attributes: ["id"] }],
        where: {
          id: { [Op.not]: req.user.id },
          role: { [Op.not]: "admin" },
        },
      });
      const Users = await rawUsers
        .map((data) => ({
          ...data.dataValues,
          FollowerCount: data.Followers.length,
          isFollowed: req.user.Followings.map((d) => d.id).includes(data.id),
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);

      // return res.json({ Profile })
      return res.render("profile", {
        isComment,
        users: TopUsers,
        profile: Profile,
        tweetsCount,
        followersCount,
        followingsCount,
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  getLikedPosts: async (req, res, done) => {
    try {
      // 前端判斷
      const isLikedPosts = true;
      //get selfInformation
      const Profile = await User.findByPk(req.params.id, {
        include: [
          { model: Tweet, attributes: ["id"] },
          { model: User, as: "Followers", attributes: ["id"] },
          { model: User, as: "Followings", attributes: ["id"] },
        ],
      });

      // get LIkeDTweet
      const rawLikedTweets = await Like.findAll({
        where: { UserId: req.params.id },
        include: [
          {
            model: Tweet,
            include: [
              { model: Like, attributes: ["id"] },
              { model: Reply, attributes: ["id"] },
              { model: User, attributes: listAttributes },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const LikedTweets = await rawLikedTweets.map((data) => ({
        ...data.dataValues,
        ReplyCount: data.Tweet.Replies.length,
        LikedCount: data.Tweet.Likes.length,
      }));

      // get Count
      const followersCount = Profile.Followers.length;
      const followingsCount = Profile.Followings.length;
      const tweetsCount = Profile.Tweets.length;

      // get Top10User
      const rawUsers = await User.findAll({
        attributes: listAttributes,
        include: [{ model: User, as: "Followers", attributes: ["id"] }],
        where: {
          id: { [Op.not]: req.user.id },
          role: { [Op.not]: "admin" },
        },
      });
      const Users = await rawUsers
        .map((data) => ({
          ...data.dataValues,
          FollowerCount: data.Followers.length,
          isFollowed: req.user.Followings.map((d) => d.id).includes(data.id),
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      const isSelf = Number(req.params.userId) === Number(user.id);
      // return res.json({ tweets: LikedTweets })
      return res.render("profile", {
        isLikedPosts,
        isSelf,
        users: TopUsers,
        tweets: LikedTweets,
        profile: Profile,
        tweetsCount,
        followersCount,
        followingsCount,
      });
      done();
    } catch (error) {
      res.status(400).json(error);
    }
  },
};

module.exports = profileController;
