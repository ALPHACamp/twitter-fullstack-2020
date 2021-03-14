const { getUser } = require('../middleware/authenticationHelper');
const { getAndNotifyFollowingUpdate } = require('../middleware/notifyHelper');
const db = require('../models');

const { Like, Tweet, User } = db;

const likesController = {
  addLike: (req, res, done) => {
    Like.create({
      UserId : getUser(req).id,
      TweetId: req.params.tweetId,
    })
    .then(() => {
      Tweet.findByPk(req.params.tweetId, {
        raw    : true,
        nest   : true,
        include: [User],
      })
      .then(async (tweet) => {
        await getAndNotifyFollowingUpdate(req, 'Like', tweet, tweet.UserId);

        res.redirect('back');
        done();
      });
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
