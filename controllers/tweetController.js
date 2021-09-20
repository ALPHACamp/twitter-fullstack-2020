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
    });
    const topUsers = await User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then((allUsers) => {
      //console.log('allUser', allUsers);
      allUsers = allUsers.map((user) => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map((d) => d.id).includes(user.id)
      }));
      allUsers = allUsers.sort((a, b) => b.FollowerCount - a.FollowerCount);
      return allUsers.slice(0, 6);
    });

    data = tweets.map((r) => ({
      ...r.dataValues,
      userId: r.User.id,
      userName: r.User.name,
      userAvatar: r.User.avatar,
      userAccount: r.User.account,
      description: r.description,
      createdA: r.createdAt,
      likeCount: r.TweetWhoLike.length,
      replayCount: r.whoReply.length
    }));
    console.log(data[1]);
    return res.render('tweetsHome', { tweets: data, topUsers });
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
      UserId:req.user.id,     
      description: req.body.newTweet
    })
      .then((restaurant) => {
        req.flash('success_messages', '推文成功!!!')
        res.redirect('/tweets')
      })  
  }, 
};
module.exports = tweetController;
