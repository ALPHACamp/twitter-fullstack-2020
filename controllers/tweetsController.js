const db = require('../models');
const { Tweet, Reply, Like, User } = db;

const tweetsController = {
  getIndexPage: (req, res) => {
    Tweet.findAll({ 
      order: [['createdAt', 'DESC']],
      include: [ User, Reply, Like ] })
    .then((tweets) => {
      const tweetsObj = JSON.parse(JSON.stringify(tweets, null, 2)).map((tweet) => ({
        ...tweet,
        ReplyCount: tweet.Replies.length,
        LikeCount : tweet.Likes.length,
      }));
      console.log(tweetsObj)
      return res.render('index', { tweets: tweetsObj });
    });
  },
};
module.exports = tweetsController;
