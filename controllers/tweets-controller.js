const { Tweet, User } = require("../models");

const tweetsController = {
  getTweets: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true });
      const tenRandomUsers = [];
      for (let i = 0; i < 8; i++) {
        const index = Math.floor(Math.random() * users.length);
        tenRandomUsers.push(users[index]);
      }
      res.render("tweets", { recommend: tenRandomUsers });
    } catch (err) {
      console.log(err);
    }
  },
  postTweet: (req, res, next) => {
    const { text } = req.body;
    console.log(text);
    if (!text) throw new Error("Content is required!");
    return Tweet.create({
      UserId: 1, //待登入功能好，存入req.user
      description: text,
    })
      .then(() => res.redirect("/tweets"))
      .catch((err) => console.log(err));
  },
};

module.exports = tweetsController;
