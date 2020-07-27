const db = require('../models');
const Tweet = db.Tweet;
const User = db.User;
const pageLimit = 7

let adminController = {
  adminLoginPage: (req, res) => {
    return res.render('admin/login');
  },
  login: (req, res) => {
    req.flash('success_messages', 'Login successfully');
    res.redirect('/admin/tweets');
  },
  getTweets: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let pageId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.pageId) {
      pageId = Number(req.query.pageId)
      whereQuery['pageId'] = pageId
    }
    Tweet.findAndCountAll({ raw: true, nest: true, where: whereQuery, offset: offset, limit: pageLimit, include: User, order: [['createdAt', 'DESC']], }).then((tweets) => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(tweets.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      console.log(tweets)
      const data = tweets.rows.map((r) => ({
        ...r,
        account: r.User.account,
        userName: r.User.name,
        userAvatar: r.User.avatar,
        description: r.description.substring(0, 50),
        createdA: r.createdAt
      }));
      return res.render('admin/tweetsHome', {
        tweets: data,
        isAdminTweet: true,
        pageId: pageId,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      });
    });
  },
  getUsers: async (req, res) => {
    let users = await User.findAll({
      include: [
        Tweet,
        { model: Tweet, as: 'userLike' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    });

    data = users.map((r) => ({
      ...r.dataValues,
      LikeCount: r.userLike.length,
      FollowerCount: r.Followers.length,
      FollowingCount: r.Followings.length,
      TweetCount: r.Tweets.length
    }));
    data = data.sort((a, b) => b.TweetCount - a.TweetCount);
    data = data.filter((user) => user.role === 'user');
    res.render('admin/tweetsUser', {
      users: data,
      isAdminUser: true
    });
  },
  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id).then((Tweet) => {
      Tweet.destroy().then((Tweet) => {
        req.flash('success_messages', '刪除成功！');
        return res.redirect('/admin/tweets');
      });
    });
  }
};

module.exports = adminController;
