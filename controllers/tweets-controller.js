const { getEightRandomUsers } = require("../helpers/randomUsersHelper");
const { Tweet, User, Reply, Like } = require("../models");

const tweetsController = {
  getTweets: async (req, res, next) => {
    try {
      const recommend = await getEightRandomUsers(req);
      const currentUserId = req.user.id;
      const tweets = await Tweet.findAll({
        include: [User, Reply, {model:User, as:'LikedUsers'}],
        order: [["updatedAt", "DESC"]],
        limit: 15,
      });
      const showTweets = tweets.map((tweet) => {
        const replies = tweet.Replies.length;
        const likes = tweet.LikedUsers.length;
        const isLiked = tweet.LikedUsers.some((l) => l.id === currentUserId);
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
      res.render("tweets", { tweets: showTweets, recommend });
    } catch (err) {
      console.log(err);
    }
  },
  postTweet: (req, res, next) => {
    const { text } = req.body;
    console.log(text);
    if (!text) throw new Error("Content is required!");
    return Tweet.create({
      UserId: req.user.id,
      description: text,
    })
      .then(() => res.redirect("/tweets"))
      .catch((err) => console.log(err));
  },
  getTweet: async (req, res, next) => {
    const recommend = await getEightRandomUsers(req);
    const { tweetId } = req.params;
    const tweet = await Tweet.findByPk(tweetId, {
      nest: true,
      include: [
        User,
        { model: Reply, include: User },
        { model: User, as:'LikedUsers'}
      ],
    });
    const repliesAmount = tweet.Replies.length;
    const likesAmount = tweet.LikedUsers.length;
    const isLiked = tweet.LikedUsers.some(l => l.id === req.user.id)

    res.render("tweet", {
      tweet: tweet.toJSON(),
      repliesAmount,
      likesAmount,
      recommend,
      isLiked
    });
  },
  addLike: async (req, res, next) => {
    try {
      const { tweetId } = req.params;
      const likes = await Like.findOne({
        where: { userId: req.user.id, TweetId: tweetId },
      });
      if (likes) throw new Error("You already liked this tweet!");
      await Like.create({
        UserId: req.user.id,
        TweetId: tweetId,
      });
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  deleteLike: async (req, res, next) => {
    try {
      const { tweetId } = req.params;
      const likes = await Like.findOne({
        where: { userId: req.user.id, TweetId: tweetId },
      });
      if (!likes) throw new Error("You already unlike it!");
      await likes.destroy();
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { text } = req.body;
      if (!text) throw new Error("Content is required!");
      if (text.length > 140) throw new Error("Exceed the maximun words!");
      await Reply.create({
        UserId: req.user.id,
        TweetId: req.params.tweetId,
        comment: text,
      });
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = tweetsController;
