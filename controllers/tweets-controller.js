const { getEightRandomUsers } = require("../helpers/randomUsersHelper");
const { Tweet, User, Reply, Like } = require("../models");
const helpers = require("../_helpers");

const tweetsController = {
  getTweets: async (req, res, next) => {
    try {
      const recommend = await getEightRandomUsers(req);
      const currentUserId = helpers.getUser(req).id;
      const tweets = await Tweet.findAll({
        include: [User, Reply, Like],
        order: [["updatedAt", "DESC"]],
        limit: 15,
      });

      const showTweets = tweets.map((tweet) => {
        const replies = tweet.Replies.length;
        const likes = tweet.Likes.length;
        const isLiked = tweet.Likes.some((l) => l.UserId === currentUserId);
        return {
          tweetId: tweet.id,
          userId: tweet.User.id,
          userAccount: tweet.User.account,
          userName: tweet.User.name,
          text: tweet.description,
          createdAt: tweet.createdAt,
          replies,
          likes,
          isLiked,
        };
      });
      return res.render("tweets", { tweets: showTweets, recommend });
    } catch (err) {
      next(err);
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body;
      const currentUserId = helpers.getUser(req).id;
      // console.log(text);
      if (!description) throw new Error("內容不可為空白");
      if (description.length > 140) throw new Error("內容不可超過140字");
      await Tweet.create({
        UserId: currentUserId,
        description,
      });
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const recommend = await getEightRandomUsers(req);
      const currentUserId = helpers.getUser(req).id;
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
      // if (likes) throw new Error("You already liked this tweet!");
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
      // if (!likes) throw new Error("You already unlike it!");
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
      return res.redirect("back");
    } catch (err) {
      next(err);
    }
  },
};

module.exports = tweetsController;
