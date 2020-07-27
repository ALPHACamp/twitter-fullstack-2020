const db = require('../models');
const Tweet = db.Tweet;
const User = db.User;
const Reply = db.Reply;

const tweetController = {
  getTweets: async (req, res) => {
    let tweets = await Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        User,
        Reply,
        { model: User, as: 'TweetWhoLike' },
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
      likeCount: r.TweetWhoLike.length,
      replayCount: r.Replies.length,
      isLiked: r.TweetWhoLike.map(d => d.id).includes(req.user.id)
    }));
    return res.render('tweetsHome', { tweets: data, isHomePage: true });
  },

  getTweet: async (req, res) => {
    const id = req.params.id;
    let tweet = await Tweet.findOne({
      where: { id },
      include: [User,
        { model: User, as: 'TweetWhoLike' },
        {
          model: Reply, order: ["createdAt", 'DESC'], include: [
            User,
            { model: User, as: 'ReplyWhoLike' }
          ]
        },
      ]
    });
    tweet = tweet.toJSON()
    let replies = tweet.Replies.map(reply => ({
      ...reply,
      RepliesLikeCount: reply.ReplyWhoLike.length,
      isReplyLiked: reply.ReplyWhoLike.map(d => d.id).includes(req.user.id)
    }))
    replies.sort((a, b) => b.createdAt - a.createdAt)
    const totalCount = {
      replyCount: tweet.Replies.length,
      likeCount: tweet.TweetWhoLike.length,
      isLiked: tweet.TweetWhoLike.map(d => d.id).includes(req.user.id)
    }
    res.render('tweet', {
      isHomePage: true,
      replies,
      tweet,
      totalCount
    });
  },
  postTweet: (req, res) => {
    if (!req.body.newTweet) {
      req.flash('error_messages', '請輸入推文內容!!!');
      return res.redirect('back');
    }
    if (Array.from(req.body.newTweet).length > 140) {
      req.flash('error_messages', '推文內容需小於140個字!!!');
      return res.redirect('back');
    }
    return Tweet.create({
      UserId: req.user.id,
      description: req.body.newTweet
    })
      .then((tweet) => {
        req.flash('success_messages', '推文成功!!!')
        res.redirect('/tweets')
      })
  },
  postComment: (req, res) => {
    let whichTweet = req.params.id
    if (!req.body.newComment) {
      req.flash('error_messages', "請輸入推文內容!!!")
      return res.redirect('back')
    }

    if (Array.from(req.body.newComment).length > 140) {
      req.flash('error_messages', '回覆內容需小於140個字!!!');
      return res.redirect('back');
    }

    return Reply.create({
      comment: req.body.newComment,
      TweetId: whichTweet,
      UserId: req.user.id
    })
      .then((tweet) => {
        req.flash('success_messages', '回覆成功!!!')
        res.redirect('back')
      })
  }
};
module.exports = tweetController;
