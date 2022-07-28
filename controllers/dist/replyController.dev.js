"use strict";

var helpers = require('../_helpers');

var _require = require('../models'),
    User = _require.User,
    Reply = _require.Reply,
    Tweet = _require.Tweet;

var replyController = {
  getReply: function getReply(req, res, next) {
    var replies;
    return regeneratorRuntime.async(function getReply$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(Reply.findAll({
              where: {
                TweetId: req.params.tweet_id
              },
              include: [User, {
                model: Tweet,
                include: User
              }]
            }));

          case 3:
            replies = _context.sent;
            return _context.abrupt("return", res.render('tweets', {
              replies: replies.toJSON()
            }));

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  postReply: function postReply(req, res, next) {
    var comment;
    return regeneratorRuntime.async(function postReply$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            comment = req.body.comment;

            if (comment) {
              _context2.next = 5;
              break;
            }

            req.flash('error_messages', '回覆內容不存在！');
            return _context2.abrupt("return", res.redirect('back'));

          case 5:
            if (!(comment.trim() === '')) {
              _context2.next = 8;
              break;
            }

            req.flash('error_messages', '回覆內容不能為空！');
            return _context2.abrupt("return", res.redirect('back'));

          case 8:
            if (!(comment && comment.length > 140)) {
              _context2.next = 11;
              break;
            }

            req.flash('error_messages', '回覆內容不能超過140字!');
            return _context2.abrupt("return", res.redirect('back'));

          case 11:
            _context2.next = 13;
            return regeneratorRuntime.awrap(Reply.create({
              UserId: helpers.getUser(req).id,
              TweetId: req.params.tweet_id,
              comment: comment
            }));

          case 13:
            req.flash('success_messages', '成功新增回覆！');
            return _context2.abrupt("return", res.redirect("/tweets/".concat(req.params.tweet_id)));

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 17]]);
  }
};
module.exports = replyController;