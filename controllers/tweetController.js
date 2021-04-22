const db = require('../models');
const Tweet = db.Tweet;
const User = db.User;

const tweetController = {
  getTweets: async (req, res) => {
    try {
      //let offset = 0;
      //   if (req.query.page) {
      //     offset = (req.query.page - 1) * pageLimit;
      //   }
      const tweets = await Tweet.findAndCountAll({
        raw: true,
        nest: true,
        // offset,
        // limit: pageLimit,
      });

      //   const page = Number(req.query.page) || 1;
      //   const pages = Math.ceil(tweets.count / pageLimit);
      //   const totalPage = Array.from({ length: pages }).map(
      //     (item, index) => index + 1
      //   );
      //   const prev = page - 1 < 1 ? 1 : page - 1;
      //   const next = page + 1 > pages ? pages : page + 1;
      // res.json({ status: 'success', message: 'getTweets' });
        return res.render('tweets', {
          tweets,
        });
    } catch (err) {
      console.log(err);
    }
  },
  getTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, {});
      res.json({ status: 'success', message: 'getTweet' });
      //   return res.render('tweet', {
      //     tweet: tweet.toJSON(),
      //   });
    } catch (err) {
      console.log(err);
    }
  },
  postTweet: async (req, res) => {
    try {
      await Tweet.create({
        description: 'test',
      });
      res.json({ status: 'success', message: 'postTweet' });

      //   return res.redirect('back');
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
