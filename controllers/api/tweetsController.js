const db = require('../../models');
const {
  Tweet, User,
} = db;
const helpers = require('../../_helpers');
const moment = require('moment');

const tweetsController = {
  getReplyPage: async (req, res) => {
    const tweetId = Number(req.params.tweetId);
    const user = helpers.getUser(req);
    Tweet.findByPk(tweetId, { 
      include: User 
    })
    .then((tweet) => {
      const createdAt = moment(tweet.createdAt).fromNow()
      const data = {
        id: tweet.id,
        avatar: tweet.User.avatar,
        name: tweet.User.name,
        account: tweet.User.account,
        description: tweet.description,
        createdAt : createdAt,
        userAvatar : user.avatar,
      };
      return res.json({
        status: 'success',
        tweet: data,
      });
    });
  },
};
module.exports = tweetsController;