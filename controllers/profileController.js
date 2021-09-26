const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const { Reply, User, Tweet, Like, Followship } = db;
const multer = require("multer");
const fs = require("fs");
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

//for test only
const { getTestUser } = require("./util.service");

const listAttributes = ["id", "name", "account", "avatar"];

const profileController = {
  getPosts: async (req, res) => {
    const user = getTestUser(req);
    try {
      // 前端判斷
      const isPost = true;
      //get selfInformation
      const myProfile = await User.findByPk(user.id, {
        attributes: ["id", "avatar"],
        raw: true,
      });
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
          { model: Like, attributes: ["id", "UserId"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      const Tweets = await rawTweets.map((data) => ({
        ...data.dataValues,
        ReplyCount: data.Replies.length,
        LikedCount: data.Likes.length,
        isLiked: data.Likes.map((data) => Number(data.UserId)).includes(
          Number(user.id)
        ),
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
          isFollowed: user.Followings.map((d) => d.id).includes(data.id),
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      const isSelf = Number(req.params.id) === Number(user.id);
      return res.render("profile", {
        isPost,
        isSelf,
        myProfile,
        users: TopUsers,
        tweets: Tweets,
        profile: Profile,
        tweetsCount,
        followersCount,
        followingsCount,
        isFollowed: Boolean(followship),
        notification: Boolean(followship ? followship.notification : false),
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },

  getComments: async (req, res) => {
    const user = getTestUser(req);
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
      // get followship
      let followship = await Followship.findOne({
        where: {
          followerId: Number(user.id),
          followingId: Number(req.params.id),
        },
      });

      const tweetsCount = Profile.Tweets.length;
      const followersCount = Profile.Followers.length;
      const followingsCount = Profile.Followings.length;

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
          isFollowed: user.Followings.map((d) => d.id).includes(data.id),
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      const isSelf = Number(req.params.id) === Number(user.id);
      // return res.json({ Profile })
      return res.render("profile", {
        isComment,
        isSelf,
        myProfile: user,
        users: TopUsers,
        profile: Profile,
        tweetsCount,
        followersCount,
        followingsCount,
        isFollowed: Boolean(followship),
        notification: Boolean(followship ? followship.notification : false),
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },

  getLikedPosts: async (req, res) => {
    const user = getTestUser(req);
    try {
      // 前端判斷
      const isLikedPosts = true;
      //get selfInformation
      const myProfile = await User.findByPk(user.id, {
        attributes: ["id", "avatar"],
        raw: true,
      });
      //get userInformation
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
        ReplyCount: data.Tweet ? data.Tweet.Replies.length : 0,
        LikedCount: data.Tweet ? data.Tweet.Likes.length : 0,
      }));

      // get Count
      const followersCount = Profile.Followers.length;
      const followingsCount = Profile.Followings.length;
      const tweetsCount = Profile.Tweets.length;

      // get followship
      let followship = await Followship.findOne({
        where: {
          followerId: Number(user.id),
          followingId: Number(req.params.id),
        },
      });

      // get Top10User
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
          isFollowed: user.Followings.map((d) => d.id).includes(data.id),
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      const isSelf = Number(req.params.id) === Number(user.id);
      // return res.json({ tweets: LikedTweets })
      return res.render("profile", {
        isLikedPosts,
        isSelf,
        myProfile,
        users: TopUsers,
        tweets: LikedTweets,
        profile: Profile,
        tweetsCount,
        followersCount,
        followingsCount,
        isFollowed: Boolean(followship),
        notification: Boolean(followship ? followship.notification : false),
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },

  putUserpage: async (req, res) => {
    const { name, introduction, avatar, cover } = req.body;
    const errors = [];
    if (!name || !introduction) {
      errors.push({ message: '名稱或自我介紹欄位，不可空白' })
    }
    if (name.length > 50) {
      errors.push({ message: '名稱必須在50字符以內' })
    }
    if (introduction.length > 160) {
      errors.push({ message: '自我介紹，必須在160字符以內' })
    }
    if (errors.length > 0) {
      return res.render("edit", { name, introduction, avatar, cover });
    }
    const images = {};
    const { files } = req;
    const uploadImg = (path) => {
      return new Promise((resolve, reject) => {
        imgur.upload(path, (err, img) => {
          if (err) {
            return reject(err);
          }
          resolve(img);
        });
      });
    };
    const user = getTestUser(req);
    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      for (const key in files) {
        images[key] = await uploadImg(files[key][0].path);
      }
    }
    const profile = await User.findByPk(user.id);
    await profile.update({
      name: name,
      introduction: introduction,
      cover: images.cover ? images.cover.data.link : profile.cover,
      avatar: images.avatar ? images.avatar.data.link : profile.avatar,
    });

    req.flash('success_msg', '您的個人資訊已更新')
    return res.redirect(`/users/${user.id}/tweets`);
  },
};

module.exports = profileController;
