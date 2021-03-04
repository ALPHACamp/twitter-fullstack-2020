const db = require('../models');

const {
  Tweet, Reply, Like, User,
} = db;
const helpers = require('../_helpers');

const tweetsController = {
  getIndexPage: (req, res) => {
    Tweet.findAll({
      order  : [['createdAt', 'DESC']],
      include: [User, Reply, Like],
    }).then((tweets) => {
      const tweetsObj = tweets.map((tweet) => ({
        ...tweet.dataValues,
        User      : tweet.dataValues.User.dataValues,
        ReplyCount: tweet.Replies.length,
        LikeCount : tweet.Likes.length,
        isLiked   : req.user.LikedTweets.map((d) => d.id).includes(tweet.id),
      }));
      User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      }).then(users => {
        const usersObj = users.map(user => ({
          ...user.dataValues,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
        }))
        return res.render('index', {
          tweets: tweetsObj,
          users: usersObj,
        })
      })
    });
  },

  createTweet: (req, res) => {
    const { description } = req.body;
    if (!description.trim()) {
      req.flash('error_messages', '請輸入文字再送出推文');
      return res.redirect('/');
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文字數不能超過140字');
      return res.redirect('/');
    }
    return Tweet.create({
      description: req.body.description,
      UserId     : helpers.getUser(req).id,
    }).then((tweet) => {
      req.flash('success_messages', '推文成功!');
      res.redirect('/');
    });
  },
};
module.exports = tweetsController;
