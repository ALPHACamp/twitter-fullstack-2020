"use strict";

var _require = require('../models'),
    Followship = _require.Followship;

var helpers = require('../_helpers');

var followshipController = {
  addFollowing: function addFollowing(req, res, next) {
    return regeneratorRuntime.async(function addFollowing$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(helpers.getUser(req).id === Number(req.body.id))) {
              _context.next = 4;
              break;
            }

            req.flash('error_messages', '自己不能追隨自己！');
            return _context.abrupt("return", res.redirect(200, 'back'));

          case 4:
            _context.next = 6;
            return regeneratorRuntime.awrap(Followship.create({
              followerId: helpers.getUser(req).id,
              followingId: req.body.id
            }));

          case 6:
            req.flash('error_messages', '追隨成功！');
            return _context.abrupt("return", res.redirect('back'));

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  removeFollowing: function removeFollowing(req, res, next) {
    var followship;
    return regeneratorRuntime.async(function removeFollowing$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(Followship.findOne({
              where: {
                followerId: helpers.getUser(req).id,
                followingId: req.params.followingId
              }
            }));

          case 3:
            followship = _context2.sent;
            _context2.next = 6;
            return regeneratorRuntime.awrap(followship.destroy());

          case 6:
            req.flash('error_messages', '取消追隨成功！');
            return _context2.abrupt("return", res.redirect('back'));

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }
};
module.exports = followshipController;