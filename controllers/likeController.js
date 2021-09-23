const db = require("../models");
const { User, Tweet, Reply, Like, Followship, sequelize } = db;
const moment = require("moment");

//for development
const { dummyuser } = require("../dummyuser.json");

//for test only
const helpers = require("../_helpers.js");
const getTestUser = function (req) {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else { return req.user }
};

const likeController = {

  changeLike: (req, res) => {
    const user = dummyuser;
    const tweetId = req.params.id
    return Like.find({
      where: {
        UserId: Number(user.id),
        TweetId: Number(tweetId)
      }})
      .then((like) => {
        if(like) return Like.destroy()
        else return Like.create({
          UserId: Number(user.id),
          TweetId: Number(tweetId)         
        })})
      .then(() => res.redirect('back'))
      .catch(error => res.status(400).json(error));
  }
};

module.exports = likeController;