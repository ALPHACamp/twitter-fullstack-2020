const moment = require('moment');
const db = require('../models');
const Tweet = db.Tweet;
const User = db.User;
const Reply = db.Reply;

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

const replyController = {
  //   getTweets: async (req, res) => {
  //     try {
  //       const tweets = await Tweet.findAndCountAll({
  //         raw: true,
  //         nest: true,
  //         include: [User],
  //       });
  //       tweets.rows.forEach((e) => {
  //         e.description = limitDescription(e.description, 120);
  //         e.time = moment(e.createdAt, 'YYYYMMDD').fromNow();
  //       });
  //       const data = tweets.rows.sort((a, b) => b.createdAt - a.createdAt);
  //       // res.json({ status: 'success', message: 'getTweets' });
  //       return res.render('tweets', {
  //         tweets: data,
  //         tweetsSidebar,
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  //   getTweet: async (req, res) => {
  //     try {
  //       const tweet = await Tweet.findByPk(req.params.id, {
  //         include: [User],
  //       });
  //       const replies = await Reply.findAndCountAll({
  //         raw: true,
  //         nest: true,
  //         where: { TweetId: tweet.toJSON().id },
  //         include: [User, { model: Tweet, include: [User] }],
  //       });
  //       console.log(replies);
  //       const time = moment(tweet.createdAt, 'YYYYMMDD').format(
  //         'a h:mm, MMMM Do YYYY'
  //       );
  //       replies.rows.forEach((e) => {
  //         e.time = moment(e.createdAt, 'YYYYMMDD').fromNow();
  //       });
  //       // res.json({ status: 'success', message: 'getTweet' });
  //       return res.render('tweet', {
  //         tweet: tweet.toJSON(),
  //         time,
  //         replies: replies.rows,
  //         count: replies.count,
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  postReply: async (req, res) => {
    try {
      console.log('hello');
      console.log('hello');
      console.log('hello');
      console.log('hello');
      console.log('req.body: ', req.body);
      if (req.body.comment == '') {
        req.flash('error_msg', '回覆內容不可為空！');
        return;
      }
      await Reply.create({
        comment: req.body.comment,
        UserId: req.user.id,
        TweetId: req.params.id,
      });
      req.flash('success_msg', '回覆成功！');
      return res.redirect('back');
    } catch (err) {
      console.log(err);
    }
  },
  //   putTweet: (req, res) => {
  //     if (!req.body.description) {
  //       //req.flash('error_messages', "請輸入文字");
  //       return res.redirect('back');
  //     }
  //     return Restaurant.findByPk(req.params.id).then((restaurant) => {
  //       restaurant
  //         .update({
  //           description: req.body.description,
  //         })
  //         .then(() => {
  //           res.json({ status: 'success', message: 'putTweet' });

  //           //   return res.redirect('back');
  //         });
  //     });
  //   },
  //   deleteTweet: async (req, res, cb) => {
  //     try {
  //       const tweet = await Tweet.findByPk(req.params.id);
  //       await tweet.destroy();
  //       res.json({ status: 'success', message: 'deleteTweet' });

  //       //   return res.redirect('back');
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
};
module.exports = replyController;
