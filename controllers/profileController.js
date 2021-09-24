const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const { Reply, User, Tweet, Like, Followship } = db;
//for test only
const helpers = require("../_helpers.js");
const getTestUser = function (req) {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};

const profileController = {
  getPosts: async (req, res) => {
    const user = getTestUser(req);
    try {
      // 前端判斷
      const isPost = true;
      //get selfInformation
      const Profile = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ],
      });
      // get selfTweet
      const rawTweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [Reply, { model: User, as: "LikedUsers" }],
        order: [["createdAt", "DESC"]],
      });
      const Tweets = await rawTweets.map((data) => ({
        ...data.dataValues,
        ReplyCount: data.Replies.length,
        LikedCount: data.LikedUsers.length,
        Replies: data.Replies.sort((a, b) => b.createdAt - a.createdAt),
        LikedUsers: data.LikedUsers.sort(
          (a, b) => b.Like.createdAt - a.Like.createdAt
        ),
      }));
      const followship = await Followship.findOne({
        where: {
          followerId: Number(user.id),
          followingId: Number(req.params.id),
        },
      });

      // get Count
      const followersCount = Profile.Followers.length;
      const followingsCount = Profile.Followings.length;
      const tweetsCount = Tweets.length;

      // get Top10User
      const rawUsers = await User.findAll({
        include: [{ model: User, as: "Followers" }],
        where: { id: { [Op.not]: req.user.id } },
      });
      const Users = await rawUsers
        .map((data) => ({
          ...data.dataValues,
          FollowerCount: data.Followers.length,
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      const isSelf = Number(req.params.userId) === Number(user.id);
      console.dir(followship.toJSON());
      // tweetsCount, followersCount, followingsCount
      // return res.json({ Tweets, TopUsers, Profile, })
      return res.render("profile", {
        isPost,
        isSelf,
        users: TopUsers,
        tweets: Tweets,
        profile: Profile,
        tweetsCount,
        followersCount,
        followingsCount,
        // isFollowed: Boolean(followship),
        // notification: Boolean(followship.notification),
      });
    } catch (error) {
      console.log(error);
    }
  },

  getComments: async (req, res) => {
    const user = getTestUser(req)
      ? getTestUser(req)
      : console.log("user is null, please check");
    try {
      //前端處理判定
      const isComment = true;
      const Profile = await User.findByPk(req.params.id, {
        include: [
          Tweet,
          {
            model: Reply,
            include: [{ model: Tweet, include: [User] }],
          },
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ],
        order: [["createdAt", "DESC"]],
      });

      const tweetsCount = Profile.Tweets.length;
      const followersCount = Profile.Followers.length;
      const followingsCount = Profile.Followings.length;

      //get Top10User
      const rawUsers = await User.findAll({
        include: [{ model: User, as: "Followers" }],
        where: { id: { [Op.not]: req.user.id } },
      });

      const Users = await rawUsers
        .map((data) => ({
          ...data.dataValues,
          FollowerCount: data.Followers.length,
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      const isSelf = Number(req.params.userId) === Number(user.id);
      // return res.json({ Profile, tweetsCount, followersCount, followingsCount })
      return res.render("profile", {
        isComment,
        isSelf,
        users: TopUsers,
        profile: Profile,
        tweetsCount,
        followersCount,
        followingsCount,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getLikedPosts: async (req, res) => {
    const user = getTestUser(req)
      ? getTestUser(req)
      : console.log("user is null, please check");
    try {
      // 前端判斷
      const isLikedPosts = true;
      //get selfInformation
      const Profile = await User.findByPk(req.params.id, {
        include: [
          Tweet,
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ],
      });

      // get LIkeDTweet
      const rawLikedTweets = await Like.findAll({
        where: { UserId: req.params.id },
        include: [
          {
            model: Tweet,
            include: [Like, Reply, User],
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
        include: [{ model: User, as: "Followers" }],
        where: {
          id: { [Op.not]: req.user.id },
          role: { [Op.not]: "admin" },
        },
      });
      const Users = await rawUsers
        .map((data) => ({
          ...data.dataValues,
          FollowerCount: data.Followers.length,
          isFollowed: req.user.Followers.map((d) => d.id).includes(req.user.id),
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      const isSelf = Number(req.params.userId) === Number(user.id);
      // return res.json({ tweets: LikedTweets, TopUsers, Profile, tweetsCount, followersCount, followingsCount })
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
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = profileController;
