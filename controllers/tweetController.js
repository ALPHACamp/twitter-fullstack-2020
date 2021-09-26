const db = require("../models");
const { Op } = require("sequelize");
const { Tweet, User, Reply, Like } = db;
const moment = require("moment");
//for development

//設定在測試模式下，使用 helper 作為 user 來源
const helpers = require("../_helpers.js");
const getTestUser = function (req) {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};

const listAttributes = ["id", "name", "account", "avatar"];
const tweetController = {
  getPosts: async (req, res) => {
    const user = getTestUser(req);
    try {
      const Profile = await User.findByPk(user.id, {
        attributes: ["id", "avatar"],
      });
      const rawTweets = await Tweet.findAll({
        include: [
          { model: User, attributes: listAttributes },
          { model: Reply, attributes: ["id"] },
          { model: User, as: "LikedUsers", attributes: ["id"] },
        ],
        order: [["createdAt", "DESC"]],
        limit: 20,
      });
      const Tweets = await rawTweets.map((data) => ({
        ...data.dataValues,
        ReplyCount: data.Replies.length,
        LikedCount: data.LikedUsers.length,
        createdAt: moment(data.createdAt).fromNow(),
      }));

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

      // add isLike property dynamically
      Tweets.forEach((Tweet) => {
        Tweet.LikedUsers.forEach((likedUser) => {
          if (Number(likedUser.id) === Number(user.id)) Tweet.isLiked = true;
        });
      });
      // return res.json({ TopUsers, Tweets, Profile })
      return res.render("index", {
        tweets: Tweets,
        users: TopUsers,
        profile: Profile,
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  getPost: async (req, res) => {
    const user = getTestUser(req);
    try {
      //get selfInformation
      const myProfile = await User.findByPk(user.id, {
        attributes: ["id", "avatar"],
        raw: true,
      });
      let tweet = await Tweet.findByPk(req.params.id, {
        include: [
          { model: User, attributes: listAttributes },
          { model: User, as: "LikedUsers", attributes: ["id"] },
          { model: Reply, include: [User] },
        ],
      });
      const ReplyCount = tweet.Replies.length;
      const LikedCount = tweet.LikedUsers.length;
      Replies = tweet.Replies.sort((a, b) => b.createdAt - a.createdAt);
      LikedUsers = tweet.LikedUsers.sort(
        (a, b) => b.Like.createdAt - a.Like.createdAt
      );

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

      //add isLike property dynamically
      tweet = tweet.toJSON();
      tweet.LikedUsers.forEach((likedUser) => {
        if (Number(likedUser.id) === Number(user.id)) tweet.isLiked = true;
      });
      // return res.json({ tweet, ReplyCount, LikedCount, user: TopUsers,})
      return res.render("post", {
        profile: myProfile,
        tweet,
        ReplyCount,
        LikedCount,
        users: TopUsers,
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  postTweet: (req, res) => {
    const user = getTestUser(req);
    const { description } = req.body;
    if (!description) {
      req.flash('tweet_message', '你並未輸入任何文字')
      return res.redirect("back");
    }
    if (description.length > 140) {
      req.flash('tweet_message', '字數不可超過140字')
      return res.redirect("back");
    } else {
      return Tweet.create({
        UserId: user.id,
        description,
      })
        .then((tweet) => {
          // console.log("成功發送推文", tweet.toJSON());
          res.redirect("back");
        })
        .catch((error) => res.status(400).json(error));
    }
  },

  postReply: (req, res) => {
    const user = getTestUser(req);
    const { comment } = req.body;
    if (!comment) {
      //req.flash('error_message', '你並未輸入任何文字')
      return res.redirect("back");
    }
    if (comment.length > 140) {
      //req.flash('error_message', '字數不可超過140字')
      return res.redirect("back");
    } else {
      return Reply.create({
        UserId: user.id,
        TweetId: req.params.id,
        comment,
      })
        .then((reply) => {
          // console.log("成功發送評論", reply.toJSON());
          res.redirect("back");
        })
        .catch((error) => res.status(400).json(error));
    }
  },
};

module.exports = tweetController;
