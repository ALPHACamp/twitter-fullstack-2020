const db = require('../models');
const { Tweet, Reply, Like, User } = db;
const helpers = require('../_helpers');

const tweetsController = {
  getIndexPage: (req, res) => {
    Tweet.findAll({ 
      order: [['createdAt', 'DESC']],
      include: [ User, Reply, Like ] })
    .then((tweets) => {
      const tweetsObj = JSON.parse(JSON.stringify(tweets, null, 2)).map((tweet) => ({
        ...tweet,
        ReplyCount: tweet.Replies.length,
        LikeCount : tweet.Likes.length,
      }));
      return res.render('index', { tweets: tweetsObj });
    });
  },

  createTweet: (req, res) => {
    const { description } = req.body
    if (!description.trim()) {
      console.log('error')
      req.flash('error_messages', '請輸入文字再送出推文');
      return res.redirect('/');
    }
    if (description.length > 140) {
      console.log('error')
      req.flash('error_messages', '推文字數不能超過140字');
      return res.redirect('/');
    }
    return Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    }).then(tweet => {
      res.redirect('/');
    })
     
    
  }
};
module.exports = tweetsController;
