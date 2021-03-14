const { getUser } = require('../middleware/authenticationHelper');
const { getAndNotifyFollowingUpdate } = require('../middleware/notifyHelper');
const db = require('../models');

const { Like, Tweet } = db;

const likesController = {
  addLike: (req, res, done) => {
    Like.create({
      UserId : getUser(req).id,
      TweetId: req.params.tweetId,
    })
    .then(() => {
      Tweet.findByPk(req.params.tweetId)
      .then(async (tweet) => {
        const tweetObj = {
          ...tweet.dataValues,
        };

        await getAndNotifyFollowingUpdate(req, 'Like', tweetObj, tweet.dataValues.UserId);

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
