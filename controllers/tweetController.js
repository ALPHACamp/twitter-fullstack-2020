const moment = require('moment');
const db = require('../models');
const Tweet = db.Tweet;
const User = db.User;
const Reply = db.Reply;
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
        include: [User],
      });
      tweets.rows.forEach((e) => {
        e.description = limitDescription(e.description, 120);
        e.time = moment(e.createdAt, 'YYYYMMDD').fromNow();
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
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [User],
      });
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: tweet.toJSON().id },
        include: [User],
      });
      const time = moment(tweet.createdAt, 'YYYYMMDD').format(
        'a h:mm, MMMM Do YYYY'
      );
      replies.forEach((e) => {
        e.time = moment(e.createdAt, 'YYYYMMDD').fromNow();
      });
      // res.json({ status: 'success', message: 'getTweet' });
      return res.render('tweet', {
        tweet: tweet.toJSON(),
        time,
        replies,
      });
    } catch (err) {
      console.log(err);
    }
  },
  postTweet: async (req, res) => {
    try {
      console.log(req.body);
      if (req.body.description == '' || req.body.description.length > 140) {
        req.flash('error_msg', '貼文限制140字以內，且內容不可為空！');
        return;
      }
      await Tweet.create({
        description: req.body.description,
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
