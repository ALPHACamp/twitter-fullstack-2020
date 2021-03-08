const { getUser } = require('../middleware/authenticationHelper');
const db = require('../models');

const { Like } = db;

const likesController = {
  addLike: (req, res, done) => {
    Like.create({
      UserId : getUser(req).id,
      TweetId: req.params.tweetId,
    })
    .then(() => {
      res.redirect('back');
      done();
    });
  },
  removeLike: (req, res, done) => {
    Like.findOne({
      where: {
        UserId : getUser(req).id,
        TweetId: req.params.tweetId,
      },
    })
    .then((like) => {
      like.destroy()
      .then(() => {
        res.redirect('back');
        done();
      });
    });
  },
};
module.exports = likesController;
