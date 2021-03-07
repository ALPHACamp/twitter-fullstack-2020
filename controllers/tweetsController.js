const { Op } = require('sequelize');
const sequelize = require('sequelize');
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
        where: {
          role: { [Op.ne]: 'admin' },
          id  : { [Op.ne]: req.user.id },
        },
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.FollowingId = User.id)'), 'FollowshipCount']],
        },
        order: [[sequelize.literal('FollowshipCount'), 'DESC']],
        limit: 10,
      }).then((users) => {
        const usersObj = users.map((user) => ({
          ...user.dataValues,
          isFollowed: req.user.Followings.map((d) => d.id).includes(user.id),
        }));
        return res.render('index', {
          tweets: tweetsObj,
          users : usersObj,
        });
      });
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

  getReplyPage: (req, res) => {
    Tweet.findByPk(req.params.tweetId, {
      include: [User, Like, { model: Reply, include: [User] }],
      order  : [[Reply, 'createdAt', 'ASC']],
    })
    .then((tweet) => {
      const time = tweet.createdAt;
      const noon = new Date('Y-m-d 12:00:00');
      const ampm = (time.getTime() < noon.getTime()) ? '上午' : '下午';
      const tweetTime = `${ampm} ${time.toLocaleString('zh-TW', { hour: 'numeric', minute: 'numeric', hour12: true }).slice(0, 4)} ・ ${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日`;
      const tweetObj = {
        ...tweet.dataValues,
        ReplyCount: tweet.Replies.length,
        LikeCount : tweet.Likes.length,
        isLiked   : req.user.LikedTweets.map((d) => d.id).includes(tweet.id),
        createdAt : tweetTime,
      };
      return res.render('index', {
        tweet  : tweetObj,
        notMain: true,
        title  : '推文',
      });
    });
  },
};
module.exports = tweetsController;
