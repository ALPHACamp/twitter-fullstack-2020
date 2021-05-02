const db = require('../models');
const Tweet = db.Tweet;
const User = db.User;
const Reply = db.Reply;
const helpers = require('../_helpers');
const Like = db.Like;

const tweetController = {
  getTweet: async (req, res) => {
    const id = req.params.id;
    let tweet = await Tweet.findOne({
      where: { id },
      include: [User, Like,
        {
          model: Reply, order: ["createdAt", 'DESC'], include: [User,
            { model: User, as: 'ReplyWhoLike' }
          ]
        },
      ]
    });
    tweet = tweet.toJSON()
    let replies = tweet.Replies.map(reply => ({
      ...reply,
      RepliesLikeCount: reply.ReplyWhoLike.length,
      isReplyLiked: reply.ReplyWhoLike.map(d => d.id).includes(helpers.getUser(req).id)
    }))
    replies.sort((a, b) => b.createdAt - a.createdAt)
    const totalCount = {
      replyCount: tweet.Replies.length,
      likeCount: tweet.Likes.length,
      isLiked: tweet.Likes.map(d => d.UserId).includes(helpers.getUser(req).id)
    }
    res.render('tweet', {
      isHomePage: true,
      replies,
      tweet,
      totalCount,
    });
  },
  getTweets: async (req, res) => {
    let tweets = await Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        User,
        Reply,
        Like,
      ]
    })
    data = tweets.map((r) => ({
      ...r.dataValues,
      userId: r.User.id,
      userName: r.User.name,
      userAvatar: r.User.avatar,
      userAccount: r.User.account,
      description: r.description,
      createdA: r.createdAt,
      likeCount: r.Likes.length,
      replayCount: r.Replies.length,
      isLiked: r.Likes.map(d => d.UserId).includes(helpers.getUser(req).id)
    }));
    return res.render('tweetsHome', { tweets: data, isHomePage: true });
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', '請輸入推文內容!!!');
      return res.redirect('back');
    }
    if (req.body.description.length > 140) {
      req.flash('error_messages', '推文內容需小於140個字!!!');
      return res.redirect('back');
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    }).then((tweet) => {
      req.flash('success_messages', '推文成功!!!');
      res.redirect('/tweets');
    });
  },
  postComment: (req, res) => {
    let whichTweet = req.params.id;
    if (!req.body.comment) {
      req.flash('error_messages', '請輸入推文內容!!!');
      return res.redirect('back');
    }

    if (req.body.comment.length > 140) {
      req.flash('error_messages', '回覆內容需小於140個字!!!');
      return res.redirect('back');
    }
    return Reply.create({
      comment: req.body.comment,
      TweetId: whichTweet,
      UserId: helpers.getUser(req).id
    }).then((tweet) => {
      req.flash('success_messages', '回覆成功!!!');
      res.redirect('back');
    });
  }
};
module.exports = tweetController;
