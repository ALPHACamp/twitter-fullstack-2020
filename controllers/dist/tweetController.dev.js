"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../models'),
    Tweet = _require.Tweet,
    User = _require.User,
    Like = _require.Like,
    Reply = _require.Reply;

var helpers = require('../_helpers');

var tweetController = {
  getTweets: function getTweets(req, res, next) {
    var tweets, users, user, likes;
    return regeneratorRuntime.async(function getTweets$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(Tweet.findAll({
              include: [User, Reply, Like],
              order: [['createdAt', 'DESC']]
            }));

          case 3:
            tweets = _context.sent;
            _context.next = 6;
            return regeneratorRuntime.awrap(User.findAll({
              include: [{
                model: User,
                as: 'Followers'
              }, {
                model: User,
                as: 'Followings'
              }]
            }));

          case 6:
            users = _context.sent;
            _context.next = 9;
            return regeneratorRuntime.awrap(User.findByPk(helpers.getUser(req).id, {
              raw: true,
              nest: true
            }));

          case 9:
            user = _context.sent;
            _context.next = 12;
            return regeneratorRuntime.awrap(Like.findAll({
              where: {
                UserId: helpers.getUser(req).id
              }
            }));

          case 12:
            likes = _context.sent;
            _context.next = 15;
            return regeneratorRuntime.awrap(tweets.map(function (tweet) {
              return _objectSpread({}, tweet.toJSON(), {
                likedCount: tweet.Likes.length,
                repliedCount: tweet.Replies.length,
                isLiked: likes.map(function (l) {
                  return l.TweetId;
                }).includes(tweet.id)
              });
            }));

          case 15:
            tweets = _context.sent;
            _context.next = 18;
            return regeneratorRuntime.awrap(users.map(function (user) {
              return _objectSpread({}, user.toJSON(), {
                followerCount: user.Followers.length,
                isFollowed: helpers.getUser(req).Followings.map(function (f) {
                  return f.id;
                }).includes(user.id)
              });
            }));

          case 18:
            users = _context.sent;
            users = users.sort(function (a, b) {
              return b.followerCount - a.followerCount;
            }).slice(0, 10);
            return _context.abrupt("return", res.render('tweets', {
              tweets: tweets,
              users: users,
              user: user
            }));

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 23]]);
  },
  getTweet: function getTweet(req, res, next) {
    var tweet, likedCount, repliedCount, isLiked;
    return regeneratorRuntime.async(function getTweet$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(Tweet.findByPk(req.params.tweet_id, {
              include: [User, {
                model: Reply,
                include: User
              }, {
                model: Like,
                include: User,
                where: {
                  UserId: helpers.getUser(req).id
                }
              }]
            }));

          case 3:
            tweet = _context2.sent;

            if (tweet) {
              _context2.next = 7;
              break;
            }

            req.flash('error_messages', 'Tweet 不存在!');
            return _context2.abrupt("return", res.redirect('back'));

          case 7:
            likedCount = tweet.Likes.length;
            repliedCount = tweet.Replies.length;
            isLiked = tweet.Likes.User.some(function (l) {
              return l === tweet.id;
            });
            return _context2.abrupt("return", res.render('tweet', {
              tweet: tweet.toJSON(),
              likedCount: likedCount,
              repliedCount: repliedCount,
              isLiked: isLiked
            }));

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 13]]);
  },
  postTweet: function postTweet(req, res, next) {
    var description;
    return regeneratorRuntime.async(function postTweet$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            description = req.body.description;

            if (description) {
              _context3.next = 5;
              break;
            }

            req.flash('error_messages', 'Tweet 內容不存在!');
            return _context3.abrupt("return", res.redirect('back'));

          case 5:
            if (!(description.trim() === '')) {
              _context3.next = 8;
              break;
            }

            req.flash('error_messages', 'Tweet 內容不能為空！');
            return _context3.abrupt("return", res.redirect('back'));

          case 8:
            if (!(description && description.length > 140)) {
              _context3.next = 11;
              break;
            }

            req.flash('error_messages', 'Tweet 內容不能超過140字!');
            return _context3.abrupt("return", res.redirect('back'));

          case 11:
            _context3.next = 13;
            return regeneratorRuntime.awrap(Tweet.create({
              UserId: helpers.getUser(req).id,
              description: description
            }));

          case 13:
            req.flash('success_messages', '成功新增Tweet!');
            return _context3.abrupt("return", res.redirect('/tweets'));

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 17]]);
  },
  postLike: function postLike(req, res, next) {
    return regeneratorRuntime.async(function postLike$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(Like.create({
              UserId: helpers.getUser(req).id,
              TweetId: req.params.tweet_id
            }));

          case 3:
            req.flash('success_messages', '成功 Like!');
            return _context4.abrupt("return", res.redirect('back'));

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  postUnlike: function postUnlike(req, res, next) {
    var like;
    return regeneratorRuntime.async(function postUnlike$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(Like.findOne({
              where: {
                UserId: helpers.getUser(req).id,
                TweetId: req.params.tweet_id
              }
            }));

          case 3:
            like = _context5.sent;

            if (like) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", req.flash('error_messages', '你沒有like這個tweet!'));

          case 6:
            _context5.next = 8;
            return regeneratorRuntime.awrap(like.destroy());

          case 8:
            req.flash('success_messages', '成功 Unlike!');
            return _context5.abrupt("return", res.redirect('back'));

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](0);
            next(_context5.t0);

          case 15:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 12]]);
  }
};
module.exports = tweetController;