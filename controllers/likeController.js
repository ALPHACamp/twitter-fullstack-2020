const db = require("../models");
const { User, Tweet, Reply, Like, Followship, sequelize } = db;
const { getTestUser } = require("../services/generalService");

const likeController = {
  changeLike: (req, res) => {
    const user = getTestUser(req);
    const tweetId = req.params.id;
    return Like.findOne({
      where: {
        UserId: Number(user.id),
        TweetId: Number(tweetId)
      }
    })
      .then((like) => {
        if (like)
          return Like.destroy({
            where: {
              UserId: Number(user.id),
              TweetId: Number(tweetId)
            }
          });
        else
          return Like.create({
            UserId: Number(user.id),
            TweetId: Number(tweetId)
          });
      })
      .then(() => res.redirect("back"))
      .catch((error) => res.status(400).json(error));
  }
};

module.exports = likeController;
