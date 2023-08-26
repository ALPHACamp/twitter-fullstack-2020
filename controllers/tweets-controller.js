const { getEightRandomUsers } = require("../helpers/randomUsersHelper");
const { Tweet, User, Reply, Like } = require("../models");
const helpers = require("../_helpers");

const tweetsController = {
  getTweets: async (req, res, next) => {
    try {
      const recommend = await getEightRandomUsers(req);
      const currentUserId = helpers.getUser(req).id;
      const currentUser = helpers.getUser(req);
      const tweets = await Tweet.findAll({
        include: [User, Reply, Like],
        order: [["updatedAt", "DESC"]],
        limit: 15,
      });

      const showTweets = tweets.map((tweet) => {
        const replies = tweet.Replies.length;
        const likes = tweet.Likes.length;
        const isLiked = tweet.Likes.some((l) => l.UserId === currentUserId);
        const userAvatar = tweet.User.avatar;
        return {
          tweetId: tweet.id,
          userId: tweet.User.id,
          userAccount: tweet.User.account,
          userName: tweet.User.name,
          userAvatar: tweet.User.avatar,
          text: tweet.description,
          createdAt: tweet.createdAt,
          replies,
          likes,
          isLiked,
          userAvatar,
        };
      });
      return res.render("tweets", {
        tweets: showTweets,
        recommend,
        currentUser,
      });
    } catch (err) {
      next(err);
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body;
      const currentUserId = helpers.getUser(req).id;
      if (!description) throw new Error("內容不可為空白");
      if (description.length > 140) throw new Error("內容不可超過140字");
      await Tweet.create({
        UserId: currentUserId,
        description,
      });
      req.flash("success_messages", "推文成功！");
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const recommend = await getEightRandomUsers(req);
      const currentUserId = helpers.getUser(req).id;
      const currentUser = helpers.getUser(req);
      const { id } = req.params;
      const tweet = await Tweet.findByPk(id, {
        nest: true,
        include: [User, { model: Reply, include: User }, Like],
      });
      const repliesAmount = tweet.Replies.length;
      const likesAmount = tweet.Likes.length;
      const isLiked = tweet.Likes.some((l) => l.UserId === currentUserId);

      return res.render("tweet", {
        tweet: tweet.toJSON(),
        repliesAmount,
        likesAmount,
        recommend,
        isLiked,
        currentUser,
      });
    } catch (err) {
      next(err);
    }
  },
  addLike: async (req, res, next) => {
    try {
      const { id } = req.params;
      const currentUserId = helpers.getUser(req).id;
      const likes = await Like.findOne({
        where: { userId: currentUserId, TweetId: id },
      });
      if (likes) throw new Error("You already liked this tweet!");
      await Like.create({
        UserId: currentUserId,
        TweetId: id,
      });
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  postUnlike: async (req, res, next) => {
    try {
      const { id } = req.params;
      const currentUserId = helpers.getUser(req).id;
      const likes = await Like.findOne({
        where: { userId: currentUserId, TweetId: id },
      });
      if (!likes) throw new Error("You already unlike it!");
      await likes.destroy();
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  postReply: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id;
      const { comment } = req.body;
      if (!comment) throw new Error("Content is required!");
      if (comment.length > 140) return;
      await Reply.create({
        UserId: currentUserId,
        TweetId: req.params.id,
        comment,
      });
      req.flash("success_messages", "留言成功！");
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  getMoreTweets: async (req, res, next) => {
    try {
      const offset = parseInt(req.params.offset) || 0;
      const limit = 15;
      const currentUserId = helpers.getUser(req).id;
      const tweets = await Tweet.findAll({
        include: [User, Reply, Like],
        order: [["updatedAt", "DESC"]],
        limit,
        offset,
      });
      console.log("tweets", tweets);
      const showTweets = tweets.map((tweet) => {
        const replies = tweet.Replies.length;
        const likes = tweet.Likes.length;
        const isLiked = tweet.Likes.some((l) => l.UserId === currentUserId);
        const userAvatar = tweet.User.avatar;
        return {
          tweetId: tweet.id,
          userId: tweet.User.id,
          userAccount: tweet.User.account,
          userName: tweet.User.name,
          userAvatar: tweet.User.avatar,
          text: tweet.description,
          createdAt: tweet.createdAt,
          replies,
          likes,
          isLiked,
          userAvatar,
        };
      });
      res.json(showTweets);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = tweetsController;
