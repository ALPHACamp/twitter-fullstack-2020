const db = require('../models');
const Tweet = db.Tweet;
const User = db.User;
const Reply = db.Reply;
const Like = db.Like;

const tweetController = {
  getTweets: async (req, res) => {
    let tweets = await Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        User,
        { model: User, as: 'TweetWhoLike' },
        { model: User, as: 'whoReply' }
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
      replayCount: r.whoReply.length,
      isLiked: r.TweetWhoLike.map(d => d.id).includes(req.user.id)
    }));
    console.log(data[0])
    return res.render('tweetsHome', { tweets: data });
  },
  getTweet: async (req, res) => {
    const id = req.params.id;
    const tweet = await Tweet.findOne({
      where: { id },
      include: [User, { model: User, as: 'whoReply' }]
    });
    const totalLike = await Like.count({
      where: { UserId: id }
    });

    const totalComment = tweet.toJSON().whoReply.length;
    const totalCount = {
      totalLike,
      totalComment
    };
    res.render('tweet', { tweet: tweet.toJSON(), totalCount });
  },
  postTweet: (req, res) => {
    if (!req.body.newTweet) {
      req.flash('error_messages', "請輸入推文內容!!!")
      return res.redirect('back')
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
    
    let whichTweet = 50//req.body.commentId 
    
    if (!req.body.newComment) {
      req.flash('error_messages', "請輸入推文內容!!!")
      return res.redirect('back')
    }
    return Reply.create({
      comment: req.body.newComment,
      TweetId: whichTweet,
      UserId: req.user.id
    })
      .then((tweet) => {
        req.flash('success_messages', '回覆成功!!!')
        res.redirect('/tweets')
      })
  },
};
module.exports = tweetController;
