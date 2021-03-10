const { Op } = require('sequelize');
const sequelize = require('sequelize');
const moment = require('moment');
const db = require('../models');

moment.locale('zh-TW');

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
        isLiked   : (helpers.getUser(req).LikedTweets || []).map((d) => d.id).includes(tweet.id),
      }));
      User.findAll({
        where: {
          role: { [Op.ne]: 'admin' },
          id  : { [Op.ne]: helpers.getUser(req).id },
        },
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM "Followships" WHERE "Followships"."followingId" = "User"."id")'), 'FollowshipCount']],
        },
        order: [[sequelize.literal('"FollowshipCount"'), 'DESC']],
        limit: 10,
      }).then((users) => {
        const usersObj = users.map((user) => ({
          ...user.dataValues,
          isFollowed: helpers.getUser(req).Followings.map((d) => d.id).includes(user.id),
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
      return res.redirect('/tweets');
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文字數不能超過140字');
      return res.redirect('/tweets');
    }
    return Tweet.create({
      description: req.body.description,
      UserId     : helpers.getUser(req).id,
    }).then((tweet) => {
      req.flash('success_messages', '推文成功');
      res.redirect('/tweets');
    });
  },

  getReplyPage: async (req, res) => {
    const tweetId = Number(req.params.tweetId);
    const user = helpers.getUser(req);
    const userId = req.params.userId ? Number(req.params.userId) : user.id;
    Tweet.findByPk(tweetId, {
      include: [User, Like, { model: Reply, include: [User] }],
      order  : [[Reply, 'createdAt', 'DESC']],
    })
    .then((tweet) => {
      const { createdAt } = tweet;
      const tweetTime = ` ${moment(createdAt).format('a h:MM')}・ ${moment(createdAt).format('LL')}`;
      const tweetObj = ({
        ...tweet.dataValues,
        User   : tweet.User.dataValues,
        Replies: tweet.Replies.map((reply) => ({
          ...reply.dataValues,
          User: { ...reply.dataValues.User.dataValues },
        })),
        ReplyCount: tweet.Replies.length,
        LikeCount : tweet.Likes.length,
        isLiked   : (user.LikedTweets || []).map((d) => d.id).includes(tweet.id),
        createdAt,
        tweetTime,
      });

      return res.render('index', {
        tweet: tweetObj,
        title: {
          text: '推文',
        },
      });
    });
  },

  creatReply: (req, res) => {
    const tweetId = Number(req.params.tweetId);
    const { comment } = req.body;
    const userId = helpers.getUser(req).id;
    if (!comment) {
      req.flash('error_messages', '請輸入文字再送出推文');
      return res.redirect(`/tweets/${tweetId}/replies`);
    }
    if (comment.length > 140) {
      req.flash('error_messages', '回覆字數不能超過140字');
      return res.redirect(`/tweets/${tweetId}/replies`);
    }
    return Reply.create({
      comment,
      UserId : userId,
      TweetId: tweetId,
    }).then((reply) => {
      req.flash('success_messages', '回覆成功');
      res.redirect('back');
    });
  },
};
module.exports = tweetsController;
