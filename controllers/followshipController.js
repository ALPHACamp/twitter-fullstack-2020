const db = require('../models');

const { Followship } = db;

const followshipController = {
  addFollowship: (req, res) => {
    if ( req.user.id === req.params.userId ) {
      req.flash('error_messages', '無法跟隨此用戶');
      res.redirect('back');
    }
    Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId,
    })
    .then(() => {
      return res.redirect('back');
    });
  },

  removeFollowship: (req, res) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId,
      },
    })
    .then((followship) => {
      followship.destroy()
      .then(() => {
        return res.redirect('back');
      });
    });
  },
};
module.exports = followshipController