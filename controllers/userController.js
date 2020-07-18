const db = require("../models");
const User = db.User;
const Tweet = db.Tweet;
const Reply = db.Reply;
const Like = db.Like;
const Followship = db.Followship

const userController = {
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet,
          include: { model: User, as: "LikedUser" },
        },
        { model: Tweet, include: Reply },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
      ],
    }).then((user) => {
      let results = user.toJSON();
      results["followingCount"] = results.Followings.length;
      results["followerCount"] = results.Followers.length;

      for (i = 0; i < results["Tweets"].length; i++) {
        results["Tweets"][i]["repliesCount"] =
          results["Tweets"][i]["Replies"].length;
        results["Tweets"][i]["likeCount"] =
          results["Tweets"][i]["LikedUser"].length;
      }

      return res.json(results);
    });
  },
  addFollowing: (req, res) => {
    const userId = req.params.userId
    return Followship.create({
      followerId: req.user.id,
      followingId: userId,
    })
      .then(() => res.redirect('back'))
      .catch(err => res.send(err))
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.userId } })
      .then(followship => {
        followship.destroy()
          .then(() => res.redirect('back'))
      })
      .catch(err => res.send(err))
  },
  userSigninPage: (req, res) => {
    res.render("userSigninPage");
  },
  userSignupPage: (req, res) => {
    res.render("userSignupPage");
  },
};

module.exports = userController;
