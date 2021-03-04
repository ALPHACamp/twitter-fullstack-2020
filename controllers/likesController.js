const db = require('../models');

const { Like } = db;

const likesController = {
  addLike: (req, res) => {
    Like.create({
      UserId : req.user.id,
      TweetId: req.params.tweetId,
    })
    .then(() => res.redirect('back'));
  },
  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId : req.user.id,
        TweetId: req.params.tweetId,
      },
    })
    .then((like) => {
      like.destroy()
      .then(() => res.redirect('back'));
    });
  },
};
module.exports = likesController;
