const db = require("../models");
const { Tweet, User, Reply, Like } = db;
const moment = require("moment");
//for development


const tweetController = {
  getPosts: async (req, res) => {
    try {
      const Profile = await User.findByPk(req.user.id, {
        include: [
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ],
      });
      const rawTweets = await Tweet.findAll({
        include: [Reply, User, { model: User, as: "LikedUsers" }],
        order: [["createdAt", "DESC"]],
        limit: 20,
      });
      const Tweets = await rawTweets.map((data) => ({
        ...data.dataValues,
        ReplyCount: data.Replies.length,
        LikedCount: data.LikedUsers.length,
        Replies: data.Replies.sort((a, b) => b.createdAt - a.createdAt),
        LikedUsers: data.LikedUsers.sort(
          (a, b) => b.Like.createdAt - a.Like.createdAt
        ),
        createdAt: moment(data.createdAt).fromNow(),
      }));
      const rawUsers = await User.findAll({
        include: [{ model: User, as: "Followers" }],
      });
      let Users = await rawUsers.map((data) => ({
        ...data.dataValues,
        FollowerCount: data.Followers.length,
      }));
      Users = Users.sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      //add isLike property dynamically
      Tweets.forEach((Tweet) => {
        Tweet.LikedUsers.forEach((likedUser) => {
          if (Number(likedUser.id) === Number(req.user.id)) Tweet.isLiked = true;
        });
      });
      // return res.json(TopUsers)
      return res.render("index", {
        tweets: Tweets,
        users: TopUsers,
        profile: Profile,
      });
    } catch (error) {
      res.status(400).json(error)
    }
  },

  getPost: async (req, res) => {
    try {
      let tweet = await Tweet.findByPk(req.params.id, {
        include: [
          User,
          { model: User, as: "LikedUsers" },
          { model: Reply, include: [User] },
        ],
      });
      const ReplyCount = tweet.Replies.length;
      const LikedCount = tweet.LikedUsers.length;
      Replies = tweet.Replies.sort((a, b) => b.createdAt - a.createdAt);
      LikedUsers = tweet.LikedUsers.sort(
        (a, b) => b.Like.createdAt - a.Like.createdAt
      );
      const createdTimeFromNow = moment(tweet.createdAt).fromNow();
      const createdTimeByReply = moment(tweet.Replies.createdAt).fromNow();
      const rawUsers = await User.findAll({
        include: [{ model: User, as: "Followers" }],
      });
      let Users = await rawUsers.map((data) => ({
        ...data.dataValues,
        FollowerCount: data.Followers.length,
      }));
      Users = Users.sort((a, b) => b.FollowerCount - a.FollowerCount);
      const TopUsers = Users.slice(0, 10);
      //add isLike property dynamically
      tweet = tweet.toJSON();
      tweet.LikedUsers.forEach((likedUser) => {
        if (Number(likedUser.id) === Number(req.user.id)) tweet.isLiked = true;
      });
      // return res.json({ tweet, ReplyCount, LikedCount, user: TopUsers, createdTimeFromNow, createdTimeByReply})
      return res.render("post", {
        profile: req.user,
        tweet,
        ReplyCount,
        LikedCount,
        users: TopUsers,
        createdTimeFromNow,
        createdTimeByReply,
      })
    } catch (error) {
      res.status(400).json(error)
    }
  },

  postTweet: (req, res) => {
    const { description } = req.body;
    if (!description) {
      //req.flash('error_message', '你並未輸入任何文字')
      return res.redirect("back");
    }
    if (description.length > 140) {
      //req.flash('error_message', '字數不可超過140字')
      return res.redirect("back");
    } else {
      return Tweet.create({
        UserId: req.user.id,
        description,
      }).then((tweet) => {
        // console.log("成功發送推文", tweet.toJSON());
        res.redirect('/tweets');
      })
        .catch(error => res.status(400).json(error));
    }
  },
};
module.exports = tweetController;
