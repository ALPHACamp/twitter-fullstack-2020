const moment = require('moment');
const db = require('../models');
const Tweet = db.Tweet;
const User = db.User;
const Reply = db.Reply;
const Like = db.Like;
const tweetsSidebar = 'tweetsSidebar';
const limitDescription = (description, limit = 120) => {
  const newRescription = [];
  if (description.length > limit) {
    description.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newRescription.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newRescription.join(' ')}...`;
  }
  return description;
};

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAndCountAll({
        raw: true,
        nest: true,
        include: [User, Like]
      });
      tweets.rows.forEach((e) => {
        e.description = limitDescription(e.description, 80);
        e.time = moment(e.createdAt, 'YYYYMMDD').fromNow();
        e.isLike = req.user.Likes.some((d) => d.UserId === e.Likes.UserId);
      });
      const data = tweets.rows.sort((a, b) => b.createdAt - a.createdAt);
      // res.json({ status: 'success', message: 'getTweets' });
      return res.render('tweets', {
        tweets: data,
        tweetsSidebar,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getTweet: async (req, res) => {
    try {
      let tweet = await Tweet.findByPk(req.params.id, {
        include: [User, Like]
      });
      tweet = tweet.toJSON();
      const replies = await Reply.findAndCountAll({
        raw: true,
        nest: true,
        where: { TweetId: tweet.id },
        include: [User, { model: Tweet, include: [User] }],
      });
      const time = moment(tweet.createdAt, 'YYYYMMDD').format(
        'a h:mm, MMMM Do YYYY'
      );
      const isLike = req.user.Likes.some((d) => d.TweetId === tweet.id);
      const likeCount = tweet.Likes.length
      replies.rows.forEach((e) => {
        e.time = moment(e.createdAt, 'YYYYMMDD').fromNow();
      });
      // res.json({ status: 'success', message: 'getTweet' });
      return res.render('tweet', {
        tweet: tweet,
        time,
        isLike,
        likeCount,
        replies: replies.rows,
        count: replies.count,
      });
    } catch (err) {
      console.log(err);
    }
  },
  postTweet: async (req, res) => {
    try {
      if (req.body.description == '' || req.body.description.length > 140) {
        req.flash('error_msg', '貼文限制140字以內，且內容不可為空！');
        return;
      }
      await Tweet.create({
        description: req.body.description,
        UserId: req.user.id,
      });
      // res.json({ status: 'success', message: 'description' });
      req.flash('success_msg', '貼文成功！');
      return res.redirect('/tweets');
    } catch (err) {
      console.log(err);
    }
  },
  putTweet: (req, res) => {
    if (!req.body.description) {
      //req.flash('error_messages', "請輸入文字");
      return res.redirect('back');
    }
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant
        .update({
          description: req.body.description,
        })
        .then(() => {
          res.json({ status: 'success', message: 'putTweet' });

          //   return res.redirect('back');
        });
    });
  },
  deleteTweet: async (req, res, cb) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id);
      await tweet.destroy();
      res.json({ status: 'success', message: 'deleteTweet' });

      //   return res.redirect('back');
    } catch (err) {
      console.log(err);
    }
  },
};
module.exports = tweetController;
